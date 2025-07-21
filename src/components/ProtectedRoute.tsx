import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, authLoading } = useAuth();

    if (authLoading) return null;

    if (!user) {
        return <Navigate to="/participants/login" replace />;
    }

    return children;
}