import { useNavigate } from "react-router-dom"
import { useUserStore } from "../../store/useUserStore"
import userApi from "../../../../api/userApi"


export const useUserLogout = () => {
    const navigate = useNavigate()
    const { clearUser } = useUserStore()

    const logout = async () => {
        try{
            await userApi.post('/logout/')
            clearUser()
            navigate('/user/login')
        } catch (err) {
            console.error('Logout Error', err)
        }
    }

    return { logout }
}