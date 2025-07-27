import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '../features/admin/pages/Login'
import Dashboard from '../features/admin/pages/Dashboard'

const AdminRoutes = () => {
  return (
    <Routes>
        <Route path="/admin-panel/login" element={<Login />} />
        <Route path="/admin-panel/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default AdminRoutes
