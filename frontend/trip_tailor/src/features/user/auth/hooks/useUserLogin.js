import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useUserStore } from "../../store/useUserStore";
import { useState } from "react";

export const useUserLogin = () => {
    const navigate = useNavigate()

    const { setUser } = useUserStore()
    const [loading, setLoading] = useState(false)

    const login = async (credentials) => {
        setLoading(true)
        try{
            const res = await loginUser(credentials)
            localStorage.setItem("access_token", res.access)

            const user = res.user
            setUser(res.user)
            if (user.is_agency != true){
                navigate('/user/Home')
            }else{
                navigate('/agency/dashboard')
            }
            
        } catch (err){
            console.error('Login error:', err.response?.data || err.message)
            throw err;
        } finally {
            setLoading(false)
        }
    }

    return { login, loading }
}