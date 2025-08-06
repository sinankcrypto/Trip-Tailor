import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Layout from '../../../layouts/admin/AdminLayout';
import RequireAdminAuth from '../../../auth/RequireAdminAuth';
import Users from '../pages/Users';
import Agencies from '../pages/Agencies';
import AgencyDetials from '../pages/AgencyDetials';

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
        <Route path="users" element={<Users/> }/>
        <Route path="agencies" element={<Agencies/>} />
        <Route path="agencies/:id" element={<AgencyDetials/>} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
