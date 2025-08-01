import { NavLink, Outlet } from "react-router-dom";
import { BarChart2 } from 'lucide-react';
import { useAdminLogout } from "../../features/admin/hooks/useAdminLogout";


const SidebarItems = [
  { name : 'Dashboard', path : '/admin-panel/dashboard'},
  { name : 'Users', path: '/admin-panel/users'},
  { name : 'Agencies', path: '/admin-panel/agencies'},
  { name : 'Bookings', path: '/admin-panel/bookings' },
  { name : 'Withdrawals', path: '/admin-panel/withdrawals'},
];

const Layout = () => {

  const { logout } = useAdminLogout();
  return (
      <div className="flex min-h-screen">
          {/*Sidebar */}
          <aside className="w-64 bg-white border-r shadow-sm p-5">
              <div>
                  <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
                  <nav className="space-y-2">
                      {SidebarItems.map((item) =>(
                          <NavLink
                          key={item.name}
                          to={item.path}
                          className={({ isActive }) =>
                              `block px-4 py-2 rounded-md font-medium ${
                                  isActive ? 'bg-gray-200 text-black' : 'hover: bg-gray-100'
                              }`
                          }
                      >
                          {item.name}
                      </NavLink>
                      ))}
                  </nav>
              </div>
              {/* Logout Button */}
              <button
                onClick={logout}
                className="mt-8 w-full px-4 py-2 rounded-md bg-gray-100 text-left text-sm text-red-600 hover:bg-red-50 transition"
              >
                Logout
              </button>
          </aside>

          {/* Main Content */}  
          <div className="flex-1 flex flex-col">
              {/*navbar*/}
              <header className="bg-white shadow-md p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xl font-semibold">
                      <BarChart2 className="w-6 h-6 text-gray-700" />
                      <span>Dashboard</span>
                  </div>
              </header>

              {/* Content */}
              <main className="p-6 flex-1 overflow-y-auto">
                  <Outlet />
              </main>
          </div>
      </div>
  );
};

export default Layout;