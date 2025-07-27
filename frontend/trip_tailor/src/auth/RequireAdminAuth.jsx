import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import adminApi from '../api/adminApi'

const RequireAdminAuth = ({ children }) => {

    const [loading, setLoading] = useState(true)
    const [authenticated, setAuthenticated] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {
            try{
                await adminApi.get('profile/')
                setAuthenticated(true)
            } catch (err){
                navigate('/admin-panel/login')
            } finally{
                setLoading(false)
            }
        }

        checkAuth()
    }, [navigate])

    if (loading) return <p>Checking Authentication...</p>

    return authenticated? children :null
}

export default RequireAdminAuth
