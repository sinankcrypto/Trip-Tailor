import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom';
import useAgencyLogout from '../../features/agency/hooks/useAgencyLogout';

const AgencyLayout = () => {
  const handleLogout = useAgencyLogout();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? 'bg-green-100 text-green-700 font-medium' : '';

  return (
    <div className="flex min-h-screen bg-gray-50 font-[Lexend]">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md border-r border-gray-200 flex flex-col">
        <div className="p-6 text-2xl font-bold text-green-700 border-b border-gray-100">
          Trip <span className="text-green-500">Tailor</span> <span className="text-sm">Agency</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 text-gray-700 text-base">
          <Link
            to="/agency/dashboard"
            className={`block px-4 py-2 rounded-md hover:bg-green-50 hover:text-green-700 transition ${isActive('/agency/dashboard')}`}
          >
            Dashboard
          </Link>
          <Link
            to="/agency/profile"
            className={`block px-4 py-2 rounded-md hover:bg-green-50 hover:text-green-700 transition ${isActive('/agency/profile')}`}
          >
            Profile
          </Link>
          <Link
            to="/agency/my-packages"
            className={`block px-4 py-2 rounded-md hover:bg-green-50 hover:text-green-700 transition ${isActive('/agency/my-packages')}`}
          >
            Packages
          </Link>
          <Link
            to="/agency/messages"
            className={`block px-4 py-2 rounded-md hover:bg-green-50 hover:text-green-700 transition ${isActive('/agency/messages')}`}
          >
            Messages
          </Link>
          <Link
            to="/agency/bookings"
            className={`block px-4 py-2 rounded-md hover:bg-green-50 hover:text-green-700 transition ${isActive('/agency/bookings')}`}
          >
            Bookings
          </Link>
          <Link
            to="/agency/transactions"
            className={`block px-4 py-2 rounded-md hover:bg-green-50 hover:text-green-700 transition ${isActive('/agency/transactions')}`}
          >
            Transactions
          </Link>
          <Link
            to="/agency/payment-settings"
            className={`block px-4 py-2 rounded-md hover:bg-green-50 hover:text-green-700 transition ${isActive('/agency/payment-settings')}`}
          >
            Payment settings
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 mt-2 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition font-medium"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-5 border-b border-gray-100">
          <h1 className="text-2xl font-semibold text-gray-700">Welcome back, Agency!</h1>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AgencyLayout
