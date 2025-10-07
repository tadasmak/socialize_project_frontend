// src/config/api.ts
const getApiUrl = (): string => {
  // First, check if we have the environment variable from Docker
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Fallback: determine based on current environment
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (isLocal) {
    return 'http://localhost:3000/api/v1';
  } else {
    // Production - use the VPS IP and port 3000 where your Rails API is running
    return 'https://socializeproject.com/api/v1';
  }
};

export const API_URL = getApiUrl();