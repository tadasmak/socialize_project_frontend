import React from "react"
import { Link } from "react-router-dom"

type Props = {
    email: string,
    setEmail: (value: string) => void,
    password: string,
    setPassword: (value: string) => void,
    onSubmit: (e: React.FormEvent) => void,
    error: string,
    action: string
}

export default function AuthenticationForm({
    email,
    setEmail,
    password,
    setPassword,
    onSubmit,
    error,
    action = 'login'
}: Props) {
    return (
        <form onSubmit={onSubmit} className="w-full max-w-md space-y-6 p-8 rounded-xl" >
            <h1 className="text-2xl font-semibold text-white text-center">{action == 'login' ? "Sign in" : "Sign up"}</h1>
            {error && (<p className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded"> {error}</p>)}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded bg-[#1d1d1d] text-white placeholder-gray-400 border border-[#444] focus:outline-none focus:ring-2 focus:ring-bg-coral" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded bg-[#1d1d1d] text-white placeholder-gray-400 border border-[#444] focus:outline-none focus:ring-2 focus:ring-[#b05c56]" required />
            <button type="submit" className="w-full py-3 bg-coral hover:bg-coral-darker text-white rounded font-semibold transition-colors duration-100 cursor-pointer">{action == 'login' ? "Log in" : "Register"}</button>
            <p className="text-sm text-gray-400 text-center">
                {action == 'login'
                    ? (<>Don't have an account? <Link to="/participants/register" className="text-[#b05c56] hover:underline">Register</Link></>)
                    : (<>Already have an account? <Link to="/participants/login" className="text-[#b05c56] hover:underline">Log in</Link></>)
                }
            </p>
        </form>
    )
}