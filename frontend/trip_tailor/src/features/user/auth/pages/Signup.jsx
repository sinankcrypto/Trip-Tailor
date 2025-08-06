import React, { useState } from 'react';
import { useUserSignup } from '../hooks/useUserSignup';
import { Link } from 'react-router-dom';
import logo from '../../../../assets/authentication/logo.png'

const Signup = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [errors, setErrors] = useState({});
  const [role, setRole] = useState('user')

  const { signup } = useUserSignup();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (form.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!form.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password';
    } else if (form.password !== form.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    signup({...form, role});
  };

  return (
    <div className="w-full p-10 bg-white font-[Lexend]">
      {/* Logo */}
      <div className="flex justify-center items-center gap-2 mb-6">
        <img src={logo} alt="Trip Tailor Logo" className="h-8" />
        <span className="text-2xl font-semibold text-green-800 tracking-wide">
          Trip <span className="text-green-600">Tailor</span>
        </span>
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
        Don't just imagine paradise, <br className="hidden md:block" /> Experience it!
      </h2>
      <p className="text-center text-gray-500 mb-6">
        We’ll help you plan your dream escape.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Toggle */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-md font-semibold border ${
              role === 'user'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-green-700 border-green-500'
            }`}
            onClick={() => setRole('user')}
          >
            User
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md font-semibold border ${
              role === 'agency'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-green-700 border-green-500'
            }`}
            onClick={() => setRole('agency')}
          >
            Agency
          </button>
        </div>

        {/* Inputs */}
        <div>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className={`border p-3 w-full rounded-md focus:outline-none focus:ring-2 ${
              errors.username ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-green-400'
            }`}
          />
          {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
        </div>

        <div>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className={`border p-3 w-full rounded-md focus:outline-none focus:ring-2 ${
              errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-green-400'
            }`}
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className={`border p-3 w-full rounded-md focus:outline-none focus:ring-2 ${
              errors.password ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-green-400'
            }`}
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
        </div>

        <div>
          <input
            name="confirm_password"
            type="password"
            value={form.confirm_password}
            onChange={handleChange}
            placeholder="Confirm Password"
            className={`border p-3 w-full rounded-md focus:outline-none focus:ring-2 ${
              errors.confirm_password ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-green-400'
            }`}
          />
          {errors.confirm_password && (
            <p className="text-red-600 text-sm mt-1">{errors.confirm_password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-md font-semibold transition"
        >
          Sign Up
        </button>
      </form>

      <p className="text-center text-sm mt-4 text-gray-700">
        Already have an account?{' '}
        <Link to="/user/login" className="text-green-600 font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Signup;
