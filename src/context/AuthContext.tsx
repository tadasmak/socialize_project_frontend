import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserType } from '../types/userTypes';
import { getCurrentUser, apiLogout } from '../api/auth';

type AuthContextType = {
    user: UserType | null;
    authLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
    updateData: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    authLoading: true,
    login: async () => { },
    logout: () => { },
    updateData: () => { }
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
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
        updateData();
    };

    const logout = () => {
        apiLogout();
        setUser(null);
    };

    const updateData = async () => {
        const user = await getCurrentUser();
        if (user) setUser(user);
        else throw new Error('Failed to fetch user after login.');
    };

    return (
        <AuthContext.Provider value={{ user, authLoading, login, logout, updateData }}>
            {children}
        </AuthContext.Provider>
    );
};