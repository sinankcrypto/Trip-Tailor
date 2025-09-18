import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import heroImage from "../../../../assets/Home/hero_image.png";
import aboutImg1 from "../../../../assets/Home/aboutImg1.png";
import aboutImg2 from "../../../../assets/Home/aboutImg2.png";
import { FiUser } from "react-icons/fi";
import { useGetLatestPackages } from "../../../packages/hooks/useGetLatestPackages";


const Home = () => {
  const navigate = useNavigate();
  const { user, clearUser } = useUserStore();
  const [showDropdown, setShowDropdown] = useState(false);

  const { packages, loading, error } = useGetLatestPackages();

  const handleLogout = () => {
    clearUser();
    setShowDropdown(false);
    navigate("/user/login");
  };

  return (
    <div className="min-h-screen font-[Lexend]">
      {/* Hero Section with Navbar */}
      <div
        className="bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <nav className="flex justify-between items-center px-8 py-6 text-white bg-transparent relative">
          {/* Logo */}
          <div className="text-2xl font-bold tracking-wide">
            Trip <span className="text-green-300">Tailor</span>
          </div>

          {/* Navigation links */}
          <ul className="flex gap-6 font-medium text-sm md:text-base items-center">
            <li className="hover:text-green-300 transition cursor-pointer">Home</li>
            <li>
              <Link
                to="/packages"
                className="hover:text-green-300 transition cursor-pointer"
              >
                Packages
              </Link>
            </li>
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
                    <button
                      onClick={() => navigate("/user/profile")}
                      className="w-full text-left px-4 py-2 border-b font-medium bg-white hover:bg-gray-100 transition rounded"
                    >
                      My Profile
                    </button>

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
                onClick={() => navigate("/user/login")}
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
            At Trip Tailor, we help you design unforgettable travel experiences
            tailored to your dreams.
          </p>
        </div>
      </div>

      {/* About Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-10">
        {/* Images Left */}
        <div className="flex gap-6">
          <img
            src={aboutImg1}
            alt="About 1"
            className="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover shadow-lg"
          />
          <img
            src={aboutImg2}
            alt="About 2"
            className="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover shadow-lg"
          />
        </div>

        {/* Text Right */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-4">About Trip Tailor</h2>
          <p className="text-gray-700 leading-relaxed">
            We believe travel is more than just visiting places — it’s about
            creating memories that last forever. At Trip Tailor, we bring you
            handpicked packages and custom tours to make your journey
            unforgettable.
          </p>
        </div>
      </section>

      {/* Latest Packages */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Latest Packages</h2>

        {loading && <p className="text-center text-gray-500">Loading packages...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {packages.slice(0, 6).map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={pkg.main_image}
                alt={pkg.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{pkg.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {pkg.description}
                </p>
                <p className="text-green-600 font-bold mb-3">₹{pkg.price}</p>
                <button
                  onClick={() => navigate(`/packages/${pkg.id}`)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
