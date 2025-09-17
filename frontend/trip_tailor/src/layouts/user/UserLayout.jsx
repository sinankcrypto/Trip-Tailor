// src/components/Layout.jsx
import { Link, Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo / Project name */}
            <Link to="/" className="text-2xl font-bold text-green-600">
              Trip Tailor
            </Link>

            {/* Nav Links */}
            <ul className="flex gap-6 font-medium text-sm md:text-base items-center">
              <li>
                <Link
                  to="/User/Home"
                  className="hover:text-green-500 transition cursor-pointer"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/packages"
                  className="hover:text-green-500 transition cursor-pointer"
                >
                  Packages
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-green-500 transition cursor-pointer"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  className="hover:text-green-500 transition cursor-pointer"
                >
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>
        </div>
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
