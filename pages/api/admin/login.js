import jwt from 'jsonwebtoken';
import { adminRateLimit } from '../../../lib/rateLimit';

// Demo admin credentials (in production, use hashed passwords and database)
const ADMIN_CREDENTIALS = {
  admin: 'admin123', // username: password
  manager: 'manager456'
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

export default async function handler(req, res) {
  // Apply rate limiting
  await new Promise((resolve) => {
    adminRateLimit(req, res, resolve);
  });

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check credentials
    if (!ADMIN_CREDENTIALS[username] || ADMIN_CREDENTIALS[username] !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        username,
        role: 'admin',
        iat: Math.floor(Date.now() / 1000)
      },
      JWT_SECRET,
      { 
        expiresIn: '8h' // 8 hours
      }
    );

    // Log successful login
    console.log(`Admin login successful: ${username} at ${new Date().toISOString()}`);

    res.status(200).json({
      success: true,
      token,
      user: {
        username,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
