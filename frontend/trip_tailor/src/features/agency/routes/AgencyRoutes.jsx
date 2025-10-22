import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AgencyLayout from '../../../layouts/agency/AgencyLayout'
import Dashboard from '../pages/Dashboard'
import RequireAgencyAuth from '../../../auth/RequireAgencyAuth'
import AgencyProfile from '../pages/AgencyProfile'
import AgencyBookingsPage from '../../bookings/pages/AgencyBookingsPage'
import AgencyBookingDetailsPage from '../../bookings/pages/AgencyBookingDetails'

const AgencyRoutes = () => {
  return (
    <Routes>
      <Route element={<RequireAgencyAuth/>}>
        <Route path="/agency" element={<AgencyLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<AgencyProfile />} />
          <Route path="bookings" element={<AgencyBookingsPage />} />
          <Route path="bookings/:id" element= {<AgencyBookingDetailsPage/>} />
        </Route>
      </Route>
    </Routes>
      
  )
}

export default AgencyRoutes
