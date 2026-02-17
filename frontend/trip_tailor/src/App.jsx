import React from 'react'
import AdminRoutes from './features/admin/routes/AdminRoutes'
import UserRoutes from './features/user/routes/UserRoutes'
import AgencyRoutes from './features/agency/routes/AgencyRoutes'
import PackageRoutes from './features/packages/routes/PackageRoutes'
import { Toaster } from "react-hot-toast"
import BookingRoutes from './features/bookings/routes/BookingRoutes'
import { PaymentRoutes } from './features/payments/routes/PaymentRoutes'
import { NotificationProvider } from './context/NotificationContext'
import { useState } from 'react'
import useNotificationSocket from './features/notification/hooks/useNotificationSocket'

const App = () => {
  return (
    <NotificationProvider>
      <div className='App'>
        <UserRoutes/>
        <AdminRoutes/>
        <AgencyRoutes/>
        <PackageRoutes/>
        <BookingRoutes/>
        <PaymentRoutes/>
        <Toaster position="top-right" />
      </div>
    </NotificationProvider>   
  )
}

export default App
