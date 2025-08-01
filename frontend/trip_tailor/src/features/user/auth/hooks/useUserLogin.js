import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useUserStore } from "../../store/useUserStore";

export const useUserLogin = () => {
    const navigate = useNavigate()

    const { setUser } = useUserStore()

    const login = async (credentials) => {
        try{
            const res = await loginUser(credentials)
            console.log(res.message)
            setUser(res.user)
            navigate('/user/Home')
        } catch (err){
            console.error('Login error:', err.response?.data || err.message)
        }
    }

    return { login }
}