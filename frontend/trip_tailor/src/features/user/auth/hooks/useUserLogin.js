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

            console.log(res.message)
            const user = res.user
            console.log(user.username)
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