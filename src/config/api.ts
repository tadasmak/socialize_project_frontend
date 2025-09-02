// src/config/api.ts
const getApiUrl = (): string => {
  // Fallback: determine based on current environment
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isLocal) {
    return 'http://localhost:3000/api/v1';
  } else {
    // Production - use the VPS IP and port 3000 where your Rails API is running
    return 'http://91.98.71.82/api/v1';
  }
};

export const API_URL = getApiUrl();

// Optional: Add logging for debugging
console.log('API URL configured as:', API_URL);