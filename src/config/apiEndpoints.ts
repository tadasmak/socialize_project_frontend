const getApiUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;

  const host = window.location.hostname;

  const isLocal =
    host === 'localhost' || host === '127.0.0.1';

  if (isLocal) {
    return 'http://localhost:3000/api/v1';
  }

  // Production - mirror current hostname to avoid mismatched subdomains
  if (host === 'www.socializeproject.com') {
    return 'https://www.socializeproject.com/api/v1';
  }

  // Default production domain
  return 'https://socializeproject.com/api/v1';
};

export const API_URL = getApiUrl();