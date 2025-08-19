import { isValidEmail, isValidPhone, isPastDate } from './utils';

// Validation schemas
const VALIDATION_RULES = {
  reservation: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+$/
    },
    email: {
      required: true,
      format: 'email'
    },
    phone: {
      required: true,
      format: 'phone'
    },
    date: {
      required: true,
      format: 'date',
      notPast: true,
      maxDaysAhead: 60
    },
    time: {
      required: true,
      format: 'time'
    },
    partySize: {
      required: true,
      type: 'number',
      min: 1,
      max: 20
    },
    specialOccasion: {
      required: false,
      enum: ['birthday', 'anniversary', 'business', 'dateNight', 'familyDinner', 'celebration', 'other']
    },
    specialRequests: {
      required: false,
      maxLength: 500
    },
    dietaryRestrictions: {
      required: false,
      maxLength: 500
    }
  },
  catering: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+$/
    },
    email: {
      required: true,
      format: 'email'
    },
    phone: {
      required: true,
      format: 'phone'
    },
    organization: {
      required: false,
      maxLength: 200
    },
    eventType: {
      required: true,
      enum: ['corporate', 'wedding', 'private_party', 'cultural_event', 'birthday', 'anniversary', 'business_meeting', 'other']
    },
    eventDate: {
      required: true,
      format: 'date',
      notPast: true,
      minDaysAhead: 7,
      maxDaysAhead: 365
    },
    eventEndDate: {
      required: false,
      format: 'date',
      notPast: true
    },
    eventTime: {
      required: false,
      format: 'time'
    },
    guestCount: {
      required: true,
      type: 'number',
      min: 10,
      max: 500
    },
    venueOption: {
      required: true,
      enum: ['our_location', 'customer_location', 'delivery_only']
    },
    venueAddress: {
      required: false,
      maxLength: 500,
      requiredIf: { field: 'venueOption', value: 'customer_location' }
    },
    venueDetails: {
      required: false,
      maxLength: 1000
    },
    menuPreferences: {
      required: false,
      maxLength: 1000
    },
    dietaryRestrictions: {
      required: false,
      maxLength: 1000
    },
    serviceStyle: {
      required: false,
      enum: ['buffet', 'plated', 'family_style', 'cocktail', 'mixed']
    },
    specialEquipment: {
      required: false,
      maxLength: 1000
    },
    detailedRequirements: {
      required: false,
      maxLength: 2000
    },
    budgetRange: {
      required: false,
      enum: ['under_1000', '1000_2500', '2500_5000', '5000_10000', 'over_10000', 'flexible']
    }
  },
  feedback: {
    customerEmail: {
      required: true,
      format: 'email'
    },
    customerName: {
      required: false,
      maxLength: 100
    },
    foodRating: {
      required: true,
      type: 'number',
      min: 1,
      max: 5
    },
    serviceRating: {
      required: true,
      type: 'number',
      min: 1,
      max: 5
    },
    ambianceRating: {
      required: false,
      type: 'number',
      min: 1,
      max: 5
    },
    overallRating: {
      required: true,
      type: 'number',
      min: 1,
      max: 5
    },
    feedbackText: {
      required: false,
      maxLength: 2000
    },
    suggestions: {
      required: false,
      maxLength: 1000
    }
  }
};

// Main validation function
export function validateData(data, schema) {
  const errors = [];
  const rules = VALIDATION_RULES[schema];

  if (!rules) {
    return {
      isValid: false,
      errors: ['Invalid validation schema']
    };
  }

  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    const fieldErrors = validateField(field, value, rule, data);
    
    if (fieldErrors.length > 0) {
      errors.push(...fieldErrors);
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

// Validate individual field
function validateField(fieldName, value, rule, allData = {}) {
  const errors = [];

  // Check if field is required
  if (rule.required && (value === undefined || value === null || value === '')) {
    errors.push(`${fieldName} is required`);
    return errors;
  }

  // Check conditional requirements
  if (rule.requiredIf && !rule.required) {
    const { field: dependentField, value: dependentValue } = rule.requiredIf;
    if (allData[dependentField] === dependentValue && (value === undefined || value === null || value === '')) {
      errors.push(`${fieldName} is required when ${dependentField} is ${dependentValue}`);
      return errors;
    }
  }

  // If field is not required and empty, skip other validations
  if (!rule.required && (value === undefined || value === null || value === '')) {
    return errors;
  }

  // Type validation
  if (rule.type && !validateType(value, rule.type)) {
    errors.push(`${fieldName} must be of type ${rule.type}`);
  }

  // Format validation
  if (rule.format && !validateFormat(value, rule.format)) {
    errors.push(`${fieldName} has invalid format`);
  }

  // Pattern validation
  if (rule.pattern && !rule.pattern.test(value)) {
    errors.push(`${fieldName} contains invalid characters`);
  }

  // Enum validation
  if (rule.enum && !rule.enum.includes(value)) {
    errors.push(`${fieldName} must be one of: ${rule.enum.join(', ')}`);
  }

  // Length validations
  if (rule.minLength && value.length < rule.minLength) {
    errors.push(`${fieldName} must be at least ${rule.minLength} characters long`);
  }

  if (rule.maxLength && value.length > rule.maxLength) {
    errors.push(`${fieldName} must be no more than ${rule.maxLength} characters long`);
  }

  // Number validations
  if (rule.min && value < rule.min) {
    errors.push(`${fieldName} must be at least ${rule.min}`);
  }

  if (rule.max && value > rule.max) {
    errors.push(`${fieldName} must be no more than ${rule.max}`);
  }

  // Date validations
  if (rule.notPast && isPastDate(value)) {
    errors.push(`${fieldName} cannot be in the past`);
  }

  if (rule.minDaysAhead) {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + rule.minDaysAhead);
    if (new Date(value) < minDate) {
      errors.push(`${fieldName} must be at least ${rule.minDaysAhead} days in advance`);
    }
  }

  if (rule.maxDaysAhead) {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + rule.maxDaysAhead);
    if (new Date(value) > maxDate) {
      errors.push(`${fieldName} cannot be more than ${rule.maxDaysAhead} days in advance`);
    }
  }

  return errors;
}

// Type validation
function validateType(value, type) {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && !isNaN(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'array':
      return Array.isArray(value);
    case 'object':
      return typeof value === 'object' && value !== null && !Array.isArray(value);
    case 'date':
      return value instanceof Date || !isNaN(Date.parse(value));
    default:
      return true;
  }
}

// Format validation
function validateFormat(value, format) {
  switch (format) {
    case 'email':
      return isValidEmail(value);
    case 'phone':
      return isValidPhone(value);
    case 'date':
      return !isNaN(Date.parse(value));
    case 'time':
      return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
    case 'url':
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    case 'postal_code':
      return /^[A-Z0-9\s-]{3,10}$/i.test(value);
    case 'currency':
      return /^\d+(\.\d{2})?$/.test(value);
    default:
      return true;
  }
}

// Specific validation functions
export function validateReservationData(data) {
  // Handle nested object values (from form libraries)
  const processedData = {};
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    
    if (value && typeof value === 'object' && value.value !== undefined) {
      processedData[key] = value.value;
    } else if (value && typeof value === 'object' && value.label !== undefined) {
      processedData[key] = value.value || value.label;
    } else {
      processedData[key] = value;
    }
  });

  const result = validateData(processedData, 'reservation');
  
  // Additional business logic validations
  if (processedData.partySize > 8) {
    // Large party validation
    if (!processedData.specialRequests || processedData.specialRequests.trim() === '') {
      result.errors.push('Large parties (8+ people) require special requests to be specified');
    }
  }

  // Validate date is within restaurant operating hours
  if (processedData.date && processedData.time) {
    const selectedDate = new Date(processedData.date);
    const dayOfWeek = selectedDate.getDay();
    
    // Check if restaurant is closed on selected day
    if (dayOfWeek === 1) { // Monday (if closed on Mondays)
      // result.errors.push('Restaurant is closed on Mondays');
    }

    // Validate time slots
    const timeSlots = [
      '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
      '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
    ];
    
    if (!timeSlots.includes(processedData.time)) {
      result.errors.push('Selected time is not available');
    }
  }

  return {
    isValid: result.errors.length === 0,
    errors: result.errors,
    processedData: processedData
  };
}

export function validateCateringData(data) {
  const result = validateData(data, 'catering');
  
  // Additional business logic validations
  if (data.eventEndDate && data.eventDate) {
    if (new Date(data.eventEndDate) < new Date(data.eventDate)) {
      result.errors.push('Event end date cannot be before start date');
    }
  }

  // Multi-day event validation
  if (data.eventEndDate && data.eventDate) {
    const startDate = new Date(data.eventDate);
    const endDate = new Date(data.eventEndDate);
    const daysDifference = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    if (daysDifference > 7) {
      result.errors.push('Multi-day events cannot exceed 7 days');
    }
  }

  // Guest count vs venue validation
  if (data.venueOption === 'our_location' && data.guestCount > 100) {
    result.errors.push('Our restaurant location can accommodate maximum 100 guests');
  }

  // Minimum lead time validation for large events
  if (data.guestCount > 100 && data.eventDate) {
    const eventDate = new Date(data.eventDate);
    const today = new Date();
    const daysDifference = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysDifference < 14) {
      result.errors.push('Events with 100+ guests require at least 14 days advance notice');
    }
  }

  return {
    isValid: result.errors.length === 0,
    errors: result.errors
  };
}

export function validateFeedbackData(data) {
  return validateData(data, 'feedback');
}

// File validation
export function validateFile(file, options = {}) {
  const errors = [];
  
  const defaults = {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    maxFiles: 5
  };
  
  const config = { ...defaults, ...options };

  // Check file size
  if (file.size > config.maxSize) {
    errors.push(`File size must be less than ${Math.round(config.maxSize / 1024 / 1024)}MB`);
  }

  // Check file type
  if (!config.allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed. Allowed types: ${config.allowedTypes.join(', ')}`);
  }

  // Check file name
  if (file.name.length > 255) {
    errors.push('File name is too long');
  }

  // Check for potentially dangerous file extensions
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.jar'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  if (dangerousExtensions.includes(fileExtension)) {
    errors.push('File type is not allowed for security reasons');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

// Batch file validation
export function validateFiles(files, options = {}) {
  const errors = [];
  const config = { maxFiles: 5, ...options };

  if (files.length > config.maxFiles) {
    errors.push(`Maximum ${config.maxFiles} files allowed`);
  }

  const fileValidations = files.map(file => validateFile(file, options));
  const allFileErrors = fileValidations.flatMap(validation => validation.errors);

  return {
    isValid: errors.length === 0 && allFileErrors.length === 0,
    errors: [...errors, ...allFileErrors],
    fileValidations: fileValidations
  };
}

// Sanitization functions
export function sanitizeReservationData(data) {
  return {
    name: sanitizeString(data.name),
    email: sanitizeEmail(data.email),
    phone: sanitizePhone(data.phone),
    date: sanitizeDate(data.date),
    time: sanitizeString(data.time),
    partySize: sanitizeNumber(data.partySize),
    specialOccasion: sanitizeString(data.specialOccasion),
    specialRequests: sanitizeText(data.specialRequests),
    dietaryRestrictions: sanitizeText(data.dietaryRestrictions)
  };
}

export function sanitizeCateringData(data) {
  return {
    name: sanitizeString(data.name),
    email: sanitizeEmail(data.email),
    phone: sanitizePhone(data.phone),
    organization: sanitizeString(data.organization),
    eventType: sanitizeString(data.eventType),
    eventDate: sanitizeDate(data.eventDate),
    eventEndDate: sanitizeDate(data.eventEndDate),
    eventTime: sanitizeString(data.eventTime),
    guestCount: sanitizeNumber(data.guestCount),
    venueOption: sanitizeString(data.venueOption),
    venueAddress: sanitizeText(data.venueAddress),
    venueDetails: sanitizeText(data.venueDetails),
    menuPreferences: sanitizeText(data.menuPreferences),
    dietaryRestrictions: sanitizeText(data.dietaryRestrictions),
    serviceStyle: sanitizeString(data.serviceStyle),
    specialEquipment: sanitizeText(data.specialEquipment),
    detailedRequirements: sanitizeText(data.detailedRequirements),
    budgetRange: sanitizeString(data.budgetRange)
  };
}

// Sanitization helper functions
function sanitizeString(value) {
  if (!value) return null;
  return value.toString().trim().substring(0, 255);
}

function sanitizeText(value) {
  if (!value) return null;
  return value.toString().trim().substring(0, 2000);
}

function sanitizeEmail(value) {
  if (!value) return null;
  return value.toString().toLowerCase().trim().substring(0, 255);
}

function sanitizePhone(value) {
  if (!value) return null;
  // Keep only digits, spaces, hyphens, parentheses, and plus sign
  return value.toString().replace(/[^\d\s\-\(\)\+]/g, '').trim().substring(0, 20);
}

function sanitizeNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
}

function sanitizeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
}

// Rate limiting validation
export function validateRateLimit(requests, maxRequests, windowMs) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  const recentRequests = requests.filter(timestamp => timestamp > windowStart);
  
  return {
    allowed: recentRequests.length < maxRequests,
    remaining: Math.max(0, maxRequests - recentRequests.length),
    resetTime: recentRequests.length > 0 ? Math.min(...recentRequests) + windowMs : now + windowMs
  };
}

// Business hours validation
export function validateBusinessHours(date, time, businessHours = {}) {
  const defaultHours = {
    0: { open: '12:00', close: '21:00' }, // Sunday
    1: { open: '11:00', close: '22:00' }, // Monday
    2: { open: '11:00', close: '22:00' }, // Tuesday
    3: { open: '11:00', close: '22:00' }, // Wednesday
    4: { open: '11:00', close: '22:00' }, // Thursday
    5: { open: '11:00', close: '23:00' }, // Friday
    6: { open: '11:00', close: '23:00' }  // Saturday
  };

  const hours = { ...defaultHours, ...businessHours };
  const dayOfWeek = new Date(date).getDay();
  const dayHours = hours[dayOfWeek];

  if (!dayHours || dayHours.closed) {
    return {
      isValid: false,
      error: 'Restaurant is closed on this day'
    };
  }

  const timeMinutes = timeToMinutes(time);
  const openMinutes = timeToMinutes(dayHours.open);
  const closeMinutes = timeToMinutes(dayHours.close);

  if (timeMinutes < openMinutes || timeMinutes > closeMinutes) {
    return {
      isValid: false,
      error: `Restaurant is open from ${dayHours.open} to ${dayHours.close} on this day`
    };
  }

  return { isValid: true };
}

function timeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}
