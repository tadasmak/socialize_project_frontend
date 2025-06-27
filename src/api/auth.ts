import { apiFetch } from '../utils/api'

const API_URL = 'http://localhost:3000/api/v1';

export const apiRegister = async (email: string, password: string) => {
    const response = await apiFetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { email, password } })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.errors || data.error);
}

export const apiLogin = async (email: string, password: string) => {
    const response = await apiFetch(`${API_URL}/users/sign_in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { email, password } })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.errors || data.error);

    const token = response.headers.get('Authorization');
    if (token) return token;

    throw new Error('No token received');
}

export const getToken = () => localStorage.getItem('authToken');

export const getCurrentUser = async () => {
    const token = getToken();

    if (!token) throw new Error('Not authenticated');

    const response = await apiFetch(`${API_URL}/current_user`, {
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data;
}

export const apiLogout = () => localStorage.removeItem('authToken');