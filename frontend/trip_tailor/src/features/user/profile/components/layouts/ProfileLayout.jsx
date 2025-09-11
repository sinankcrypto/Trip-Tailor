import React from "react";
import { Link, Outlet } from "react-router-dom";
import {
  User,
  CalendarCheck,
  Heart,
  CreditCard,
  MessageCircle,
  Settings as SettingsIcon,
  LogOut
} from "lucide-react";

const sidebarItems = [
  { label: "Profile", path: "/profile", icon: User },
  { label: "Bookings", path: "/profile/bookings", icon: CalendarCheck },
  { label: "Wishlist", path: "/profile/wishlist", icon: Heart },
  { label: "Payments", path: "/profile/payments", icon: CreditCard },
  { label: "Messages", path: "/profile/messages", icon: MessageCircle },
  { label: "Settings", path: "/profile/settings", icon: SettingsIcon },
];

const ProfileLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-jakarta bg-white text-gray-800">
      {/* Navbar */}
      <header className="w-full bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-bold text-green-700">
            Trip <span className="text-green-500">Tailor</span>
          </div>

          {/* Nav Links */}
          <nav className="flex space-x-8 text-gray-600 font-medium">
            <Link to="/user/home" className="hover:text-green-600 transition">
              Home
            </Link>
            <span className="hover:text-green-600 transition cursor-pointer">
              About Us
            </span>
            <span className="hover:text-green-600 transition cursor-pointer">
              Contact
            </span>
          </nav>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-50 border-r border-gray-200 shadow-sm p-6 flex flex-col justify-between">
          <nav className="space-y-2">
            {sidebarItems.map(({ label, path, icon: Icon }) => (
              <Link
                key={label}
                to={path}
                className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-green-50 hover:text-green-700 transition"
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="pt-4 border-t border-gray-200">
            <button className="flex items-center gap-3 w-full text-left px-4 py-2 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition font-medium">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;
