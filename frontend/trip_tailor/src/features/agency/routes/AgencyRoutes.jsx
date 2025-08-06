import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AgencyLayout from '../../../layouts/agency/AgencyLayout'
import Dashboard from '../pages/Dashboard'
import RequireAgencyAuth from '../../../auth/RequireAgencyAuth'
import AgencyProfile from '../pages/AgencyProfile'

const AgencyRoutes = () => {
  return (
    <Routes>
      <Route element={<RequireAgencyAuth/>}>
        <Route path="/agency" element={<AgencyLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<AgencyProfile />} />
        </Route>
      </Route>
    </Routes>
    
    
  )
}

export default AgencyRoutes
