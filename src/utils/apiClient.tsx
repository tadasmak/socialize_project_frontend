import { API_URL } from '../config/apiEndpoints';

export const apiFetch = (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const completeUrl = endpoint.startsWith('http')
        ? endpoint
        : `${API_URL}${endpoint}`

    return fetch(completeUrl, { ...options, headers });
}