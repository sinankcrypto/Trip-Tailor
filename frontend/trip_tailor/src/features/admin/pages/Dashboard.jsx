import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import adminApi from '../../../api/adminApi'

const Dashboard = () => {

    const [admin, setAdmin] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAdmin = async () => {
            try{
                const res = await adminApi.get('profile/',{
                  withCredentials: true
                })
                setAdmin(res.data)
            } catch(err){
                console.log("Error while fetching admin profile:", err);
                navigate('/admin-panel/login')
            } finally{
                setLoading(false)
            }
        }

        fetchAdmin()
    },[navigate])

    if (loading) return <p>Loading...</p>
    
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, {admin?.username}!</p>
      <p>Email: {admin?.email}</p>
      
    </div>
  )
}

export default Dashboard
