const API_URL = 'http://localhost:3000/api/v1';

export const register = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.errors || data.error);
}

export const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/sign_in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.errors || data.error);
    localStorage.setItem('authToken', data.token);
}

export const getToken = () => localStorage.getItem('authToken');

export const logout = () => localStorage.removeItem('authToken');