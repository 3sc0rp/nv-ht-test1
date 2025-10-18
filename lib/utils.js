import crypto from 'crypto';

// Generate confirmation codes
export function generateConfirmationCode() {
  // Generate a 6-character alphanumeric code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate unique booking reference
export function generateBookingReference(type = 'RES') {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${type}-${timestamp}-${random}`;
}

// Validate email format
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number format (international format)
export function isValidPhone(phone) {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

// Format date for display
export function formatDate(date, locale = 'en-US', options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Date(date).toLocaleDateString(locale, defaultOptions);
}

// Format time for display
export function formatTime(time, format12Hour = true) {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  
  if (format12Hour) {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  }
  
  return `${hours}:${minutes}`;
}

// Calculate age from date
export function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// Check if date is in the past
export function isPastDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  return checkDate < today;
}

// Check if date is within business hours
export function isWithinBusinessHours(date, time, businessHours = {}) {
  const defaults = {
    monday: { open: '12:00', close: '22:00', closed: false },
    tuesday: { open: '12:00', close: '22:00', closed: false },
    wednesday: { open: '12:00', close: '22:00', closed: false },
    thursday: { open: '12:00', close: '22:00', closed: false },
    friday: { open: '12:00', close: '23:00', closed: false },
    saturday: { open: '12:00', close: '23:00', closed: false },
    sunday: { open: '12:00', close: '22:00', closed: false }
  };
  
  const hours = { ...defaults, ...businessHours };
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayOfWeek = dayNames[new Date(date).getDay()];
  const dayHours = hours[dayOfWeek];
  
  if (dayHours.closed) return false;
  
  const timeMinutes = timeToMinutes(time);
  const openMinutes = timeToMinutes(dayHours.open);
  const closeMinutes = timeToMinutes(dayHours.close);
  
  return timeMinutes >= openMinutes && timeMinutes <= closeMinutes;
}

// Convert time string to minutes
function timeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

// Add time to a time string
export function addTime(timeString, hoursToAdd, minutesToAdd = 0) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + (hoursToAdd * 60) + minutesToAdd;
  
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
}

// Calculate price with tax and tip
export function calculateTotalPrice(basePrice, taxRate = 0.08, tipPercentage = 0.18) {
  const subtotal = parseFloat(basePrice);
  const tax = subtotal * taxRate;
  const tip = subtotal * tipPercentage;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    tip: Math.round(tip * 100) / 100,
    total: Math.round((subtotal + tax + tip) * 100) / 100
  };
}

// Format currency
export function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// Slugify text for URLs
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Sanitize input for database
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .substring(0, 1000); // Limit length
}

// Hash password
export function hashPassword(password) {
  return crypto.pbkdf2Sync(password, process.env.PASSWORD_SALT || 'default-salt', 1000, 64, 'sha512').toString('hex');
}

// Verify password
export function verifyPassword(password, hash) {
  const hashedPassword = hashPassword(password);
  return hashedPassword === hash;
}

// Generate secure random string
export function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Mask sensitive data
export function maskEmail(email) {
  if (!email || !email.includes('@')) return email;
  
  const [username, domain] = email.split('@');
  const maskedUsername = username.substring(0, 2) + '*'.repeat(username.length - 2);
  return `${maskedUsername}@${domain}`;
}

export function maskPhone(phone) {
  if (!phone) return phone;
  
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 10) return phone;
  
  const masked = cleaned.substring(0, 3) + '*'.repeat(cleaned.length - 6) + cleaned.substring(cleaned.length - 3);
  return masked;
}

// Deep clone object
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const copy = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone(obj[key]);
    });
    return copy;
  }
}

// Debounce function
export function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Throttle function
export function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Check if value is empty
export function isEmpty(value) {
  return (
    value == null ||
    (typeof value === 'string' && value.trim().length === 0) ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  );
}

// Get file extension
export function getFileExtension(filename) {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

// Format file size
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Generate color from string (for avatars, etc.)
export function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

// Get initials from name
export function getInitials(name) {
  if (!name) return '';
  
  return name
    .split(' ')
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
}

// Check if user agent is mobile
export function isMobile(userAgent) {
  if (!userAgent) return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

// Get country from phone number
export function getCountryFromPhone(phone) {
  if (!phone) return null;
  
  const cleaned = phone.replace(/\D/g, '');
  
  // Simple country code detection (expand as needed)
  const countryCodes = {
    '1': 'US/CA',
    '44': 'UK',
    '49': 'DE',
    '33': 'FR',
    '39': 'IT',
    '34': 'ES',
    '81': 'JP',
    '86': 'CN',
    '91': 'IN'
  };
  
  for (const [code, country] of Object.entries(countryCodes)) {
    if (cleaned.startsWith(code)) {
      return country;
    }
  }
  
  return null;
}

// Validate credit card number (Luhn algorithm)
export function validateCreditCard(cardNumber) {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i));
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

// Get business days between two dates
export function getBusinessDaysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let businessDays = 0;
  
  const currentDate = new Date(start);
  
  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      businessDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return businessDays;
}

// Rate limiting helper
export function createRateLimiter(maxRequests, windowMs) {
  const requests = new Map();
  
  return (identifier) => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Get existing requests for this identifier
    const userRequests = requests.get(identifier) || [];
    
    // Filter out old requests
    const recentRequests = userRequests.filter(timestamp => timestamp > windowStart);
    
    // Check if under limit
    if (recentRequests.length < maxRequests) {
      recentRequests.push(now);
      requests.set(identifier, recentRequests);
      return { allowed: true, remaining: maxRequests - recentRequests.length };
    }
    
    return { 
      allowed: false, 
      remaining: 0,
      resetTime: Math.min(...recentRequests) + windowMs
    };
  };
}
