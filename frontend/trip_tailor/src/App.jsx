import React from 'react'
import AdminRoutes from './routes/AdminRoutes'
import UserRoutes from './features/user/routes/UserRoutes'

const App = () => {
  return (
    <div className='App'>
      <UserRoutes/>
      <AdminRoutes/>
    </div>
  )
}

export default App
