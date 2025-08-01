import React, { useState } from 'react';
import { useAdminLogin } from '../hooks/useAdminLogin';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { handleLogin, loading, error } = useAdminLogin();

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin(username, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white font-sans">
            <div className="w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-200">
                <h2 className="text-3xl font-bold mb-6 text-center text-black">Admin Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={username}
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
                    />
                    <input
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-300 text-black py-3 text-lg rounded-xl font-semibold shadow-sm hover:bg-gray-400 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-center"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>


                </form>
                {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default Login;
