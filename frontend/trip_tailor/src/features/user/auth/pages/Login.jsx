import React, { useState, useEffect } from 'react';
import { useUserLogin } from '../hooks/useUserLogin';
import { useGoogleLogin } from '../hooks/useGoogleLogin';
import { Link } from 'react-router-dom';
import logo from '../../../../assets/authentication/logo.png';
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [role, setRole] = useState('user'); // default role selection

  const { login, loading } = useUserLogin();
  const { googleLogin } = useGoogleLogin();

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstError = Object.values(validationErrors)[0];
      toast.error(firstError);
      return;
    }

    try {
      await login({ username, password });
      toast.success('Logged in successfully!');
    } catch (err) {
      const message = err?.response?.data?.detail || 'Login failed';
      toast.error(message);
    }
  };

  // Google login callback
  const handleGoogleCallback = (googleUser) => {
    const idToken = googleUser.credential; // GIS provides `credential` token
    googleLogin(idToken, role); // call our hook
  };

  // Initialize Google Identity Services button
  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
      });

      google.accounts.id.renderButton(
        document.getElementById('google-login-btn'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    }
  }, [role]);

  return (
    <div className="w-full p-10 bg-white font-[Lexend]">
      {/* Logo + Brand */}
      <div className="flex justify-center items-center gap-2 mb-6">
        <img src={logo} alt="Trip Tailor Logo" className="h-8" />
        <span className="text-2xl font-semibold text-green-800 tracking-wide">
          Trip <span className="text-green-600">Tailor</span>
        </span>
      </div>

      {/* Title + Subtitle */}
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
        Don't just imagine paradise, <br className="hidden md:block" /> Experience it!
      </h2>
      <p className="text-center text-gray-500 mb-6">
        We’ll help you plan your dream escape.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrors({ ...errors, username: '' });
            }}
            placeholder="Username"
            className={`border p-3 w-full rounded-md focus:outline-none focus:ring-2 ${
              errors.username ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-green-400'
            }`}
          />
          {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: '' });
            }}
            placeholder="Password"
            className={`border p-3 w-full rounded-md focus:outline-none focus:ring-2 ${
              errors.password ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-green-400'
            }`}
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold transition"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Google Login Button */}
      <div className="mt-4" id="google-login-btn"></div>

      {/* Footer Text */}
      <p className="text-center text-sm mt-4 text-gray-700">
        Don't have an account?{' '}
        <Link to="/user/signup" className="text-green-600 font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
