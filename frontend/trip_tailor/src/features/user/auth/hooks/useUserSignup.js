import { useNavigate } from "react-router-dom";
import { signupUser } from "../services/authService";

export const useUserSignup = () => {
    const navigate = useNavigate()

    const signup = async (formData) => {
        try{
            const res = await signupUser(formData)
            console.log(res.message)

            navigate('/user/verify-otp',{
                state: {
                    username: res.username,
                    email: res.email,
                }
            })
        } catch (err) {
            console.error('Signup error:', err.response?.message )
        }
    }

    return { signup }
}