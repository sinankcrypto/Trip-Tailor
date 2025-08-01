import { Routes, Route } from 'react-router-dom';
import Login from '../features/admin/pages/Login';
import Dashboard from '../features/admin/pages/Dashboard';
import Layout from '../layouts/admin/AdminLayout';
import RequireAdminAuth from '../auth/RequireAdminAuth'; // adjust path if needed

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/admin-panel/login" element={<Login />} />

      {/* Protected layout and nested routes */}
      <Route
        path="/admin-panel"
        element={
          <RequireAdminAuth>
            <Layout />
          </RequireAdminAuth>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        {/* Other nested routes like users, agencies, etc. can go here */}
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
