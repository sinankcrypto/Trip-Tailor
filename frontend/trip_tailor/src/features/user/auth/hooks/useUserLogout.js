import { useNavigate } from "react-router-dom"
import { useUserStore } from "../../store/useUserStore"
import apiClient from "../../../../api/apiClient"


export const useUserLogout = () => {
    const navigate = useNavigate()
    const { clearUser } = useUserStore()

    const logout = async () => {
        try{
            await apiClient.post('/user/logout/')
            clearUser()
            navigate('/user/login')
        } catch (err) {
            console.error('Logout Error', err)
        }
    }

    return { logout }
}