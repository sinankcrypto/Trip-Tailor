// src/components/Layout.jsx
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useUserStore } from "../../features/user/store/useUserStore";
import { FiUser } from "react-icons/fi";
import { useState } from "react";
import { useUserLogout } from "../../features/user/auth/hooks/useUserLogout";
import { Bell } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import NotificationDropdown from "../../features/notification/components/NotificationDropdown";

const UserLayout = () => {

  const { user, clearUser } = useUserStore();
  const { unreadCount } = useNotifications();

  const [showDropdown, setShowDropdown] = useState(false);

  const { logout } = useUserLogout();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout()
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 text-gray-700 bg-gray-50 relative">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide">
          Trip <span className="text-green-300">Tailor</span>
        </div>

        {/* Navigation links */}
        <ul className="flex gap-6 font-medium text-sm md:text-base items-center">
          <li className="hover:text-green-300 transition cursor-pointer">
            <Link
              to="/user/home"
              className="hover:text-green-300 transition cursor-pointer"
            >
              Home
            </Link>
          </li>
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
          <div className="relative">
            <div onClick={() => setOpen((prev) => !prev)} className="cursor-pointer">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>

            <NotificationDropdown
              isOpen={open}
              onClose={() => setOpen(false)}
            />
          </div>
        </ul>
      </nav>
      {/* Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer (optional) */}
      <footer className="bg-gray-100 text-center py-4 text-sm text-gray-600">
        © {new Date().getFullYear()} Trip Tailor. All rights reserved.
      </footer>
    </div>
  );
};

export default UserLayout;
