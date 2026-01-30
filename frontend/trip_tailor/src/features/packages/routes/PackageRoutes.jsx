import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MyPackagesPage from '../pages/MyPackagesPage'
import CreatePackagePage from '../pages/CreatePackagePage'
import EditPackagePage from '../pages/EditPackagePage'
import AgencyPackageDetailsPage from '../pages/AgencyPackageDetails'
import RequireAgencyAuth from '../../../auth/RequireAgencyAuth'
import AgencyLayout from '../../../layouts/agency/AgencyLayout'

const PackageRoutes = () => {
  return (
    <Routes>
      <Route element= {<RequireAgencyAuth/>}>
        <Route path='/agency' element = {<AgencyLayout/>}>
          <Route path='my-packages' element= {<MyPackagesPage/>} />
          <Route path='packages/create' element= {<CreatePackagePage/>} />
          <Route path='packages/:id' element= {<AgencyPackageDetailsPage/>} />
          <Route path='packages/:id/edit' element= {<EditPackagePage/>} />
        </Route>
      </Route>
    </Routes>
  
  )
}

export default PackageRoutes
