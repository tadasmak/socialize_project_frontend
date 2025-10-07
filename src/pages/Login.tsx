import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { apiLogin } from '../api/auth';
import { useAuth } from '../context/AuthContext';

import AuthenticationForm from '../components/AuthenticationForm';


export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { login: contextLogin } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = await apiLogin(email, password);
            await contextLogin(token);

            toast.success('Logged in', {
                position: 'bottom-center',
                autoClose: 3000,
                pauseOnHover: true,
                theme: 'dark',
                className: 'bg-gradient text-white',
            });

            navigate('/activities');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="lg:w-1/2 mx-auto">
            <div className="bg-[#292929] ring-1 ring-black ring-opacity-5 flex justify-center rounded-xl p-6 shadow-lg">
                <AuthenticationForm
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    onSubmit={handleSubmit}
                    error={error}
                    action={'login'}
                />
            </div>
        </div>
    );
}

export default Login;