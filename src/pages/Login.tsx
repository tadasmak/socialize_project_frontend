import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

import { apiLogin } from '../api/auth';
import { useAuth } from '../context/AuthContext';

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
        <div className="lg:w-1/2 m-auto">
            <div className="bg-[#292929] ring-1 ring-black ring-opacity-5 flex justify-center rounded-xl p-6 shadow-lg">
                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 p-8 rounded-xl">
                    <h1 className="text-2xl font-semibold text-white text-center">Sign in</h1>

                    {error && ( <p className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded"> {error}</p> )}

                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded bg-[#1d1d1d] text-white placeholder-gray-400 border border-[#444] focus:outline-none focus:ring-2 focus:ring-bg-coral" required/>

                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded bg-[#1d1d1d] text-white placeholder-gray-400 border border-[#444] focus:outline-none focus:ring-2 focus:ring-[#b05c56]" required/>

                    <button type="submit" className="w-full py-3 bg-coral hover:bg-coral-darker text-white rounded font-semibold transition-colors duration-100 cursor-pointer">Log in</button>

                    <p className="text-sm text-gray-400 text-center">Don't have an account? <Link to="/participants/register" className="text-[#b05c56] hover:underline">Register</Link></p>
                </form>
            </div>
        </div>
    );
}

export default Login;