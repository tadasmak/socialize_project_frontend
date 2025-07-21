import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, apiLogout } from '../api/auth';

type User = {
    id: number;
    username: string;
    email: string;
    age: number;
}

type AuthContextType = {
    user: User | null;
    authLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    authLoading: true,
    login: async () => {},
    logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    
    useEffect(() => {
        const initialize = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return setAuthLoading(false);

            try {
                const user = await getCurrentUser();
                if (user) setUser(user);
            } catch {
                localStorage.removeItem('authToken');
                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        };

        initialize();
    }, []);

    const login = async (token: string) => {
        localStorage.setItem('authToken', token.split(' ')[1]);

        const user = await getCurrentUser();
        if (user) {
            setUser(user);
        } else {
            throw new Error('Failed to fetch user after login.');
        }
    };

    const logout = () => {
        apiLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, authLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};