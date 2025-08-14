// Rate limiting middleware for API protection
import { validateRateLimit } from './validation';

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map();

// Rate limit configurations
const RATE_LIMIT_CONFIGS = {
  reservations: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 requests per 15 minutes per IP
    message: 'Too many reservation requests. Please try again in 15 minutes.',
    skipSuccessfulRequests: false
  },
  catering: {
    windowMs: 30 * 60 * 1000, // 30 minutes
    maxRequests: 3, // 3 requests per 30 minutes per IP
    message: 'Too many catering requests. Please try again in 30 minutes.',
    skipSuccessfulRequests: false
  },
  feedback: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10, // 10 requests per hour per IP
    message: 'Too many feedback submissions. Please try again in 1 hour.',
    skipSuccessfulRequests: true
  },
  availability: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 30, // 30 requests per 5 minutes per IP
    message: 'Too many availability checks. Please slow down.',
    skipSuccessfulRequests: true
  },
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes per IP
    message: 'Too many requests. Please try again later.',
    skipSuccessfulRequests: true
  },
  admin: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 50, // 50 requests per 5 minutes per IP
    message: 'Too many admin requests. Please slow down.',
    skipSuccessfulRequests: false
  }
};

// Main rate limiting middleware
export function rateLimit(endpoint = 'general') {
  return async (req, res, next) => {
    try {
      const config = RATE_LIMIT_CONFIGS[endpoint] || RATE_LIMIT_CONFIGS.general;
      const clientId = getClientIdentifier(req);
      const key = `${endpoint}:${clientId}`;
      
      // Get current requests for this client
      const clientRequests = rateLimitStore.get(key) || [];
      const now = Date.now();
      
      // Clean expired requests
      const validRequests = clientRequests.filter(
        timestamp => timestamp > (now - config.windowMs)
      );
      
      // Check rate limit
      const limitCheck = validateRateLimit(validRequests, config.maxRequests, config.windowMs);
      
      if (!limitCheck.allowed) {
        const retryAfter = Math.ceil((limitCheck.resetTime - now) / 1000);
        
        // Log rate limit hit
        console.warn(`Rate limit exceeded for ${clientId} on ${endpoint}`, {
          clientId,
          endpoint,
          requestCount: validRequests.length,
          maxRequests: config.maxRequests,
          windowMs: config.windowMs,
          retryAfter
        });
        
        return res.status(429).json({
          error: config.message,
          retryAfter: retryAfter,
          remaining: limitCheck.remaining,
          resetTime: new Date(limitCheck.resetTime).toISOString()
        });
      }
      
      // Add current request
      validRequests.push(now);
      rateLimitStore.set(key, validRequests);
      
      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': config.maxRequests,
        'X-RateLimit-Remaining': limitCheck.remaining - 1,
        'X-RateLimit-Reset': new Date(limitCheck.resetTime).toISOString(),
        'X-RateLimit-Window': config.windowMs
      });
      
      // Store rate limit info for potential removal on successful request
      req.rateLimitInfo = {
        key,
        config,
        timestamp: now
      };
      
      if (next) {
        next();
      }
    } catch (error) {
      console.error('Rate limiting error:', error);
      // If rate limiting fails, allow the request to proceed
      if (next) {
        next();
      }
    }
  };
}

// Remove rate limit entry on successful request (for endpoints that skip successful requests)
export function removeOnSuccess(req, res) {
  if (req.rateLimitInfo && req.rateLimitInfo.config.skipSuccessfulRequests) {
    try {
      const { key, timestamp } = req.rateLimitInfo;
      const clientRequests = rateLimitStore.get(key) || [];
      const updatedRequests = clientRequests.filter(ts => ts !== timestamp);
      
      if (updatedRequests.length > 0) {
        rateLimitStore.set(key, updatedRequests);
      } else {
        rateLimitStore.delete(key);
      }
    } catch (error) {
      console.error('Error removing successful rate limit entry:', error);
    }
  }
}

// Get client identifier (IP address with fallbacks)
function getClientIdentifier(req) {
  // Try different headers for IP address
  const possibleIPs = [
    req.ip,
    req.connection?.remoteAddress,
    req.socket?.remoteAddress,
    req.headers['x-forwarded-for']?.split(',')[0]?.trim(),
    req.headers['x-real-ip'],
    req.headers['x-client-ip'],
    req.headers['cf-connecting-ip'], // Cloudflare
    req.headers['x-forwarded'],
    req.headers['forwarded-for'],
    req.headers['forwarded']
  ];
  
  // Return the first valid IP address
  for (const ip of possibleIPs) {
    if (ip && typeof ip === 'string' && ip !== '::1' && ip !== '127.0.0.1') {
      return ip;
    }
  }
  
  // Fallback to a default identifier
  return 'unknown';
}

// Clean up expired entries periodically
export function cleanupRateLimitStore() {
  const now = Date.now();
  const keysToDelete = [];
  
  for (const [key, requests] of rateLimitStore.entries()) {
    // Find the config for this key
    const endpoint = key.split(':')[0];
    const config = RATE_LIMIT_CONFIGS[endpoint] || RATE_LIMIT_CONFIGS.general;
    
    // Filter out expired requests
    const validRequests = requests.filter(
      timestamp => timestamp > (now - config.windowMs)
    );
    
    if (validRequests.length === 0) {
      keysToDelete.push(key);
    } else {
      rateLimitStore.set(key, validRequests);
    }
  }
  
  // Delete empty entries
  keysToDelete.forEach(key => rateLimitStore.delete(key));
  
  console.log(`Cleaned up ${keysToDelete.length} expired rate limit entries`);
}

// Start cleanup interval (run every 5 minutes)
let cleanupInterval;
export function startRateLimitCleanup() {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
  }
  
  cleanupInterval = setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
  console.log('Rate limit cleanup interval started');
}

// Stop cleanup interval
export function stopRateLimitCleanup() {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
    console.log('Rate limit cleanup interval stopped');
  }
}

// Get current rate limit status for a client
export function getRateLimitStatus(req, endpoint = 'general') {
  const config = RATE_LIMIT_CONFIGS[endpoint] || RATE_LIMIT_CONFIGS.general;
  const clientId = getClientIdentifier(req);
  const key = `${endpoint}:${clientId}`;
  
  const clientRequests = rateLimitStore.get(key) || [];
  const now = Date.now();
  
  const validRequests = clientRequests.filter(
    timestamp => timestamp > (now - config.windowMs)
  );
  
  const limitCheck = validateRateLimit(validRequests, config.maxRequests, config.windowMs);
  
  return {
    endpoint,
    clientId,
    allowed: limitCheck.allowed,
    remaining: limitCheck.remaining,
    resetTime: new Date(limitCheck.resetTime).toISOString(),
    windowMs: config.windowMs,
    maxRequests: config.maxRequests,
    currentRequests: validRequests.length
  };
}

// Reset rate limit for a specific client and endpoint
export function resetRateLimit(clientId, endpoint) {
  const key = `${endpoint}:${clientId}`;
  rateLimitStore.delete(key);
  console.log(`Rate limit reset for ${clientId} on ${endpoint}`);
}

// Get all rate limit statistics
export function getRateLimitStats() {
  const stats = {
    totalClients: 0,
    totalRequests: 0,
    endpointStats: {},
    storeSize: rateLimitStore.size
  };
  
  const clientIds = new Set();
  
  for (const [key, requests] of rateLimitStore.entries()) {
    const [endpoint, clientId] = key.split(':');
    clientIds.add(clientId);
    
    if (!stats.endpointStats[endpoint]) {
      stats.endpointStats[endpoint] = {
        clients: new Set(),
        totalRequests: 0
      };
    }
    
    stats.endpointStats[endpoint].clients.add(clientId);
    stats.endpointStats[endpoint].totalRequests += requests.length;
    stats.totalRequests += requests.length;
  }
  
  stats.totalClients = clientIds.size;
  
  // Convert Sets to counts
  Object.keys(stats.endpointStats).forEach(endpoint => {
    stats.endpointStats[endpoint].uniqueClients = stats.endpointStats[endpoint].clients.size;
    delete stats.endpointStats[endpoint].clients;
  });
  
  return stats;
}

// Middleware for specific endpoints
export const reservationRateLimit = rateLimit('reservations');
export const cateringRateLimit = rateLimit('catering');
export const feedbackRateLimit = rateLimit('feedback');
export const availabilityRateLimit = rateLimit('availability');
export const adminRateLimit = rateLimit('admin');
export const generalRateLimit = rateLimit('general');

// Express middleware wrapper for easier integration
export function createRateLimitMiddleware(endpoint = 'general') {
  const middleware = rateLimit(endpoint);
  
  return (req, res, next) => {
    middleware(req, res, next);
  };
}

// DDoS protection middleware (stricter limits)
export function ddosProtection() {
  const ddosConfig = {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 20, // 20 requests per minute
    message: 'Too many requests from this IP. Please slow down.'
  };
  
  return async (req, res, next) => {
    const clientId = getClientIdentifier(req);
    const key = `ddos:${clientId}`;
    
    const clientRequests = rateLimitStore.get(key) || [];
    const now = Date.now();
    
    const validRequests = clientRequests.filter(
      timestamp => timestamp > (now - ddosConfig.windowMs)
    );
    
    const limitCheck = validateRateLimit(validRequests, ddosConfig.maxRequests, ddosConfig.windowMs);
    
    if (!limitCheck.allowed) {
      console.warn(`DDoS protection triggered for ${clientId}`, {
        clientId,
        requestCount: validRequests.length,
        maxRequests: ddosConfig.maxRequests
      });
      
      return res.status(429).json({
        error: ddosConfig.message,
        retryAfter: Math.ceil((limitCheck.resetTime - now) / 1000)
      });
    }
    
    validRequests.push(now);
    rateLimitStore.set(key, validRequests);
    
    next();
  };
}

// Whitelist middleware (bypass rate limiting for trusted IPs)
export function createWhitelistMiddleware(whitelist = []) {
  return (req, res, next) => {
    const clientId = getClientIdentifier(req);
    
    if (whitelist.includes(clientId)) {
      // Skip rate limiting for whitelisted IPs
      return next();
    }
    
    // Continue with normal rate limiting
    next();
  };
}

// User-based rate limiting (for authenticated users)
export function userRateLimit(endpoint = 'general') {
  return async (req, res, next) => {
    try {
      // Use user ID if authenticated, otherwise fall back to IP
      const userId = req.user?.id || req.session?.userId;
      const clientId = userId ? `user:${userId}` : getClientIdentifier(req);
      
      const config = RATE_LIMIT_CONFIGS[endpoint] || RATE_LIMIT_CONFIGS.general;
      const key = `${endpoint}:${clientId}`;
      
      const clientRequests = rateLimitStore.get(key) || [];
      const now = Date.now();
      
      const validRequests = clientRequests.filter(
        timestamp => timestamp > (now - config.windowMs)
      );
      
      const limitCheck = validateRateLimit(validRequests, config.maxRequests, config.windowMs);
      
      if (!limitCheck.allowed) {
        return res.status(429).json({
          error: config.message,
          retryAfter: Math.ceil((limitCheck.resetTime - now) / 1000)
        });
      }
      
      validRequests.push(now);
      rateLimitStore.set(key, validRequests);
      
      req.rateLimitInfo = {
        key,
        config,
        timestamp: now
      };
      
      next();
    } catch (error) {
      console.error('User rate limiting error:', error);
      next();
    }
  };
}

// Initialize rate limiting system
export function initializeRateLimit() {
  startRateLimitCleanup();
  console.log('Rate limiting system initialized');
  console.log('Configured endpoints:', Object.keys(RATE_LIMIT_CONFIGS));
}

// Graceful shutdown
export function shutdownRateLimit() {
  stopRateLimitCleanup();
  rateLimitStore.clear();
  console.log('Rate limiting system shut down');
}
