import React from 'react'
import { useUserStore } from '../features/user/store/useUserStore'
import { Navigate, Outlet } from 'react-router-dom';

const RequireAgencyAuth = () => {
    const { user } = useUserStore();

    if (!user){
        return <Navigate to= "user/login" replace />
    }

    if (!user.is_agency){
        return <Navigate to= "user/home" replace /> 
    }

  return <Outlet/>
}

export default RequireAgencyAuth
