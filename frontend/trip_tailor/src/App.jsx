import React from 'react'
import AdminRoutes from './features/admin/routes/AdminRoutes'
import UserRoutes from './features/user/routes/UserRoutes'
import AgencyRoutes from './features/agency/routes/AgencyRoutes'

const App = () => {
  return (
    <div className='App'>
      <UserRoutes/>
      <AdminRoutes/>
      <AgencyRoutes/>
    </div>
  )
}

export default App
