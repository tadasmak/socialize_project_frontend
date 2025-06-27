export const apiFetch = (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('authToken');
    const headers = {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    return fetch(url, { ...options, headers });
}