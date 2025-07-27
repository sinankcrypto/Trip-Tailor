import { useState } from "react"
import { loginAdmin } from "../services/authService"
import { useNavigate } from "react-router-dom"

export const useAdminLogin = () =>{
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleLogin = async (username, password) => {
        setLoading(true)
        setError(null)

        try{
            await loginAdmin({username, password})
            navigate('/admin-panel/dashboard')
        }catch (err){
            setError(err.response?.data?.detail || 'Login failed')
        }finally{
            setLoading(false)
        }
    }
    return { handleLogin, loading, error }
}
