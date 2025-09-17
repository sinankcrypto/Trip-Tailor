import React from 'react'
import AdminRoutes from './features/admin/routes/AdminRoutes'
import UserRoutes from './features/user/routes/UserRoutes'
import AgencyRoutes from './features/agency/routes/AgencyRoutes'
import PackageRoutes from './features/packages/routes/PackageRoutes'
import { Toaster } from "react-hot-toast"

const App = () => {
  return (
    <div className='App'>
      <UserRoutes/>
      <AdminRoutes/>
      <AgencyRoutes/>
      <PackageRoutes/>
      <Toaster position="top-right" />
    </div>
  )
}

export default App
