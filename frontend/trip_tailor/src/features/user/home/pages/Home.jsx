import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import heroImage from '../../../../assets/Home/hero_image.png'
import { FiUser } from 'react-icons/fi';

const Home = () => {
  const navigate = useNavigate();
  const { user, clearUser } = useUserStore();
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    clearUser();
    setShowDropdown(false);
    navigate('/user/login');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat font-[Lexend]"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 text-white bg-transparent relative">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide">
          Trip <span className="text-green-300">Tailor</span>
        </div>

        {/* Navigation links */}
        <ul className="flex gap-6 font-medium text-sm md:text-base items-center">
          <li className="hover:text-green-300 transition cursor-pointer">Home</li>
          <li className="hover:text-green-300 transition cursor-pointer">Discover</li>
          <li className="hover:text-green-300 transition cursor-pointer">Services</li>
          <li className="hover:text-green-300 transition cursor-pointer">About Us</li>
          <li className="hover:text-green-300 transition cursor-pointer">Contact Us</li>

          {/* Profile/Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="ml-4 p-2 rounded-full hover:bg-white/10 transition"
              >
                <FiUser size={22} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-2 border-b">
                    <span className="font-medium">Hi, {user.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/user/login')}
              className="ml-4 border border-white px-4 py-1 rounded hover:bg-white hover:text-green-700 transition text-sm"
            >
              Login
            </button>
          )}
        </ul>
      </nav>

      {/* Hero Text */}
      <div className="flex flex-col items-center justify-center text-center text-white h-[80vh] px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          Explore the world with a smile
        </h1>
        <p className="text-lg md:text-xl max-w-2xl drop-shadow-md">
          At Trip Tailor, we help you design unforgettable travel experiences tailored to your dreams.
        </p>
      </div>
    </div>
  );
};

export default Home;
