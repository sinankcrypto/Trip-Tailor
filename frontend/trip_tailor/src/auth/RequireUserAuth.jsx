import React from 'react'
import { useUserStore } from '../features/user/store/useUserStore'
import { Navigate, Outlet } from 'react-router-dom'

const RequireUserAuth = ({ children }) => {
    const { user } = useUserStore()

    if (!user || user.is_agency) {
        return < Navigate to= "/user/login" replace />
    }

  return <Outlet/>
}

export default RequireUserAuth
