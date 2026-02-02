import React from "react";
import { Link, Outlet } from "react-router-dom";
import {
  User,
  CalendarCheck,
  Heart,
  CreditCard,
  MessageCircle,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";
import { useUserLogout } from "../../../auth/hooks/useUserLogout";

const sidebarItems = [
  { label: "Profile", path: "/user/profile", icon: User },
  { label: "Bookings", path: "/user/bookings", icon: CalendarCheck },
  { label: "Transactions", path: "/user/transactions", icon: CreditCard },
  { label: "Messages", path: "/user/messages", icon: MessageCircle },
];

const ProfileLayout = () => {
  const { logout } = useUserLogout();

  return (
    <div className="h-screen flex flex-col font-jakarta bg-white text-gray-800 overflow-hidden">
      {/* Navbar (FIXED HEIGHT) */}
      <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <div className="text-2xl font-bold text-green-700">
            Trip <span className="text-green-500">Tailor</span>
          </div>

          <nav className="flex space-x-8 text-gray-600 font-medium">
            <Link to="/user/home" className="hover:text-green-600 transition">
              Home
            </Link>
            <span className="hover:text-green-600 cursor-pointer">
              About Us
            </span>
            <span className="hover:text-green-600 cursor-pointer">
              Contact
            </span>
          </nav>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">
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

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-2 rounded-md text-red-600 hover:bg-red-50 transition font-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;
