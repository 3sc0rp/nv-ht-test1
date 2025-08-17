import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { validateFile, validateFiles } from './validation';
import { generateConfirmationCode } from './utils';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const stat = promisify(fs.stat);

// File upload configuration
const UPLOAD_CONFIG = {
  catering: {
    destination: 'uploads/catering',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    allowedTypes: [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.doc', '.docx']
  },
  feedback: {
    destination: 'uploads/feedback',
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 3,
    allowedTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp']
  },
  admin: {
    destination: 'uploads/admin',
    maxFileSize: 20 * 1024 * 1024, // 20MB
    maxFiles: 10,
    allowedTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'application/pdf',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.csv', '.xls', '.xlsx']
  }
};

// Create upload directories
async function ensureUploadDirectories() {
  try {
    for (const config of Object.values(UPLOAD_CONFIG)) {
      await mkdir(config.destination, { recursive: true });
    }
    console.log('Upload directories created/verified');
  } catch (error) {
    console.error('Error creating upload directories:', error);
  }
}

// Generate unique filename
function generateUniqueFilename(originalname) {
  const timestamp = Date.now();
  const random = generateConfirmationCode(6);
  const extension = path.extname(originalname);
  const nameWithoutExt = path.basename(originalname, extension);
  
  // Clean filename
  const cleanName = nameWithoutExt
    .replace(/[^a-zA-Z0-9\-_]/g, '')
    .substring(0, 50);
  
  return `${cleanName}_${timestamp}_${random}${extension}`;
}

// Custom multer storage
function createStorage(uploadType) {
  const config = UPLOAD_CONFIG[uploadType];
  
  return multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        await ensureUploadDirectories();
        cb(null, config.destination);
      } catch (error) {
        cb(error);
      }
    },
    filename: (req, file, cb) => {
      try {
        const uniqueName = generateUniqueFilename(file.originalname);
        cb(null, uniqueName);
      } catch (error) {
        cb(error);
      }
    }
  });
}

// File filter function
function createFileFilter(uploadType) {
  const config = UPLOAD_CONFIG[uploadType];
  
  return (req, file, cb) => {
    try {
      // Check file type
      if (!config.allowedTypes.includes(file.mimetype)) {
        const error = new Error(`File type ${file.mimetype} is not allowed`);
        error.code = 'INVALID_FILE_TYPE';
        return cb(error);
      }
      
      // Check file extension
      const extension = path.extname(file.originalname).toLowerCase();
      if (!config.allowedExtensions.includes(extension)) {
        const error = new Error(`File extension ${extension} is not allowed`);
        error.code = 'INVALID_FILE_EXTENSION';
        return cb(error);
      }
      
      // Additional security checks
      if (file.originalname.includes('../') || file.originalname.includes('..\\')) {
        const error = new Error('Invalid file path');
        error.code = 'INVALID_FILE_PATH';
        return cb(error);
      }
      
      cb(null, true);
    } catch (error) {
      cb(error);
    }
  };
}

// Create multer instance for different upload types
export function createUploader(uploadType = 'catering') {
  const config = UPLOAD_CONFIG[uploadType];
  
  if (!config) {
    throw new Error(`Invalid upload type: ${uploadType}`);
  }
  
  return multer({
    storage: createStorage(uploadType),
    fileFilter: createFileFilter(uploadType),
    limits: {
      fileSize: config.maxFileSize,
      files: config.maxFiles,
      fieldSize: 1024 * 1024, // 1MB for form fields
      fieldNameSize: 100,
      headerPairs: 2000
    }
  });
}

// Main file upload function (simplified API)
export async function uploadFiles(req, uploadType = 'catering', fieldName = 'files') {
  return new Promise((resolve, reject) => {
    const uploader = createUploader(uploadType);
    const config = UPLOAD_CONFIG[uploadType];
    const upload = uploader.array(fieldName, config.maxFiles);
    
    upload(req, {}, (error) => {
      if (error) {
        console.error('File upload error:', error);
        
        let errorMessage = 'File upload failed';
        
        switch (error.code) {
          case 'LIMIT_FILE_SIZE':
            errorMessage = `File size exceeds ${Math.round(config.maxFileSize / 1024 / 1024)}MB limit`;
            break;
          case 'LIMIT_FILE_COUNT':
            errorMessage = `Maximum ${config.maxFiles} files allowed`;
            break;
          case 'LIMIT_UNEXPECTED_FILE':
            errorMessage = 'Unexpected file field';
            break;
          case 'INVALID_FILE_TYPE':
          case 'INVALID_FILE_EXTENSION':
          case 'INVALID_FILE_PATH':
            errorMessage = error.message;
            break;
        }
        
        return reject(new Error(errorMessage));
      }
      
      // Validate uploaded files
      if (req.files && req.files.length > 0) {
        const fileValidation = validateFiles(req.files, {
          maxSize: config.maxFileSize,
          allowedTypes: config.allowedTypes,
          maxFiles: config.maxFiles
        });
        
        if (!fileValidation.isValid) {
          // Remove uploaded files if validation fails
          cleanupFiles(req.files.map(file => file.path));
          return reject(new Error(`File validation failed: ${fileValidation.errors.join(', ')}`));
        }
        
        // Return file metadata
        const uploadedFiles = req.files.map(file => ({
          originalname: file.originalname,
          filename: file.filename,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype,
          uploadType: uploadType,
          uploadedAt: new Date().toISOString()
        }));
        
        resolve(uploadedFiles);
      } else {
        resolve([]);
      }
    });
  });
}

// Middleware for handling file uploads
export function handleFileUpload(uploadType = 'catering', fieldName = 'files') {
  const uploader = createUploader(uploadType);
  const config = UPLOAD_CONFIG[uploadType];
  
  return async (req, res, next) => {
    try {
      const upload = uploader.array(fieldName, config.maxFiles);
      
      upload(req, res, (error) => {
        if (error) {
          console.error('File upload error:', error);
          
          let errorMessage = 'File upload failed';
          let statusCode = 400;
          
          switch (error.code) {
            case 'LIMIT_FILE_SIZE':
              errorMessage = `File size exceeds ${Math.round(config.maxFileSize / 1024 / 1024)}MB limit`;
              break;
            case 'LIMIT_FILE_COUNT':
              errorMessage = `Maximum ${config.maxFiles} files allowed`;
              break;
            case 'LIMIT_UNEXPECTED_FILE':
              errorMessage = 'Unexpected file field';
              break;
            case 'INVALID_FILE_TYPE':
            case 'INVALID_FILE_EXTENSION':
            case 'INVALID_FILE_PATH':
              errorMessage = error.message;
              break;
            default:
              errorMessage = 'File upload failed';
              statusCode = 500;
          }
          
          return res.status(statusCode).json({ error: errorMessage });
        }
        
        // Validate uploaded files
        if (req.files && req.files.length > 0) {
          const fileValidation = validateFiles(req.files, {
            maxSize: config.maxFileSize,
            allowedTypes: config.allowedTypes,
            maxFiles: config.maxFiles
          });
          
          if (!fileValidation.isValid) {
            // Remove uploaded files if validation fails
            cleanupFiles(req.files.map(file => file.path));
            
            return res.status(400).json({
              error: 'File validation failed',
              details: fileValidation.errors
            });
          }
          
          // Add file metadata to request
          req.uploadedFiles = req.files.map(file => ({
            originalname: file.originalname,
            filename: file.filename,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype,
            uploadType: uploadType,
            uploadedAt: new Date().toISOString()
          }));
        }
        
        next();
      });
    } catch (error) {
      console.error('File upload middleware error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

// Cleanup files (delete from filesystem)
export async function cleanupFiles(filePaths) {
  try {
    const deletePromises = filePaths.map(async (filePath) => {
      try {
        await unlink(filePath);
        console.log(`Deleted file: ${filePath}`);
      } catch (error) {
        console.error(`Error deleting file ${filePath}:`, error);
      }
    });
    
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error during file cleanup:', error);
  }
}

// Get file info
export async function getFileInfo(filePath) {
  try {
    const stats = await stat(filePath);
    return {
      exists: true,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory()
    };
  } catch (error) {
    return { exists: false, error: error.message };
  }
}

// Validate file before processing
export function validateUploadedFile(file, uploadType = 'catering') {
  const config = UPLOAD_CONFIG[uploadType];
  
  // Check file size
  if (file.size > config.maxFileSize) {
    return {
      isValid: false,
      error: `File size exceeds ${Math.round(config.maxFileSize / 1024 / 1024)}MB limit`
    };
  }
  
  // Check file type
  if (!config.allowedTypes.includes(file.mimetype)) {
    return {
      isValid: false,
      error: `File type ${file.mimetype} is not allowed`
    };
  }
  
  // Check file extension
  const extension = path.extname(file.originalname).toLowerCase();
  if (!config.allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: `File extension ${extension} is not allowed`
    };
  }
  
  return { isValid: true };
}

// Process uploaded files for database storage
export function processUploadedFiles(files, uploadType = 'catering') {
  if (!files || files.length === 0) {
    return [];
  }
  
  return files.map(file => ({
    original_name: file.originalname,
    file_name: file.filename,
    file_path: file.path,
    file_size: file.size,
    mime_type: file.mimetype,
    upload_type: uploadType,
    uploaded_at: new Date().toISOString()
  }));
}

// Create download URL for files
export function createFileUrl(filename, uploadType = 'catering') {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/api/files/${uploadType}/${filename}`;
}

// Middleware for serving uploaded files
export function serveUploadedFile(uploadType = 'catering') {
  return async (req, res) => {
    try {
      const { filename } = req.query;
      const config = UPLOAD_CONFIG[uploadType];
      
      if (!filename) {
        return res.status(400).json({ error: 'Filename is required' });
      }
      
      // Security check: prevent directory traversal
      if (filename.includes('../') || filename.includes('..\\')) {
        return res.status(400).json({ error: 'Invalid filename' });
      }
      
      const filePath = path.join(process.cwd(), config.destination, filename);
      
      // Check if file exists
      const fileInfo = await getFileInfo(filePath);
      if (!fileInfo.exists) {
        return res.status(404).json({ error: 'File not found' });
      }
      
      // Set appropriate headers
      const extension = path.extname(filename).toLowerCase();
      let contentType = 'application/octet-stream';
      
      if (extension === '.pdf') {
        contentType = 'application/pdf';
      } else if (['.jpg', '.jpeg'].includes(extension)) {
        contentType = 'image/jpeg';
      } else if (extension === '.png') {
        contentType = 'image/png';
      } else if (extension === '.webp') {
        contentType = 'image/webp';
      }
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Length', fileInfo.size);
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache
      
      // Stream the file
      const fs = require('fs');
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      
    } catch (error) {
      console.error('Error serving file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

// Clean up old files (run periodically)
export async function cleanupOldFiles(maxAge = 30 * 24 * 60 * 60 * 1000) { // 30 days
  try {
    const fs = require('fs');
    const readdir = promisify(fs.readdir);
    
    for (const [uploadType, config] of Object.entries(UPLOAD_CONFIG)) {
      try {
        const files = await readdir(config.destination);
        
        for (const filename of files) {
          const filePath = path.join(config.destination, filename);
          const fileInfo = await getFileInfo(filePath);
          
          if (fileInfo.exists) {
            const fileAge = Date.now() - fileInfo.created.getTime();
            
            if (fileAge > maxAge) {
              await unlink(filePath);
              console.log(`Cleaned up old file: ${filePath}`);
            }
          }
        }
      } catch (error) {
        console.error(`Error cleaning up ${uploadType} files:`, error);
      }
    }
  } catch (error) {
    console.error('Error during file cleanup:', error);
  }
}

// Get upload statistics
export async function getUploadStats() {
  try {
    const fs = require('fs');
    const readdir = promisify(fs.readdir);
    
    const stats = {};
    
    for (const [uploadType, config] of Object.entries(UPLOAD_CONFIG)) {
      try {
        const files = await readdir(config.destination);
        let totalSize = 0;
        let fileCount = 0;
        const fileTypes = {};
        
        for (const filename of files) {
          const filePath = path.join(config.destination, filename);
          const fileInfo = await getFileInfo(filePath);
          
          if (fileInfo.exists && fileInfo.isFile) {
            fileCount++;
            totalSize += fileInfo.size;
            
            const extension = path.extname(filename).toLowerCase();
            fileTypes[extension] = (fileTypes[extension] || 0) + 1;
          }
        }
        
        stats[uploadType] = {
          fileCount,
          totalSize,
          totalSizeMB: Math.round(totalSize / 1024 / 1024 * 100) / 100,
          fileTypes,
          maxFileSize: config.maxFileSize,
          maxFiles: config.maxFiles,
          allowedTypes: config.allowedTypes
        };
      } catch (error) {
        stats[uploadType] = { error: error.message };
      }
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting upload stats:', error);
    return { error: error.message };
  }
}

// Initialize upload system
export async function initializeFileUpload() {
  try {
    await ensureUploadDirectories();
    console.log('File upload system initialized');
    console.log('Upload types configured:', Object.keys(UPLOAD_CONFIG));
  } catch (error) {
    console.error('Error initializing file upload system:', error);
  }
}

// Middleware exports for different upload types
export const cateringUpload = handleFileUpload('catering', 'files');
export const feedbackUpload = handleFileUpload('feedback', 'images');
export const adminUpload = handleFileUpload('admin', 'documents');

// File serving exports
export const serveCateringFile = serveUploadedFile('catering');
export const serveFeedbackFile = serveUploadedFile('feedback');
export const serveAdminFile = serveUploadedFile('admin');
