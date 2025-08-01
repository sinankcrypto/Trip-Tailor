import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';

const Home = () => {
  const navigate = useNavigate();
  const { user, clearUser } = useUserStore();

  const handleLogout = () => {
    clearUser();
    navigate('/user/login');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-[Lexend]">
      <div className="p-6 rounded shadow-lg border border-green-500 max-w-md w-full text-center">
        <h1 className="text-3xl font-semibold text-green-700 mb-4">Welcome to Trip Tailor {user?.username} </h1>

        <p className="mb-6 text-gray-700">
          {user ? `Logged in as ${user.username}` : 'Please login to explore tour packages.'}
        </p>

        {user ? (
          <button
            onClick={handleLogout}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/user/login"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition inline-block"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;
