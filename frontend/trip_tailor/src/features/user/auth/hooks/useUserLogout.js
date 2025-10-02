import { useNavigate } from "react-router-dom"
import { useUserStore } from "../../store/useUserStore"
import apiClient from "../../../../api/apiClient"
import toast from "react-hot-toast"


export const useUserLogout = () => {
    const navigate = useNavigate()
    const { clearUser } = useUserStore()

    const logout = async () => {
        try{
            await apiClient.post('/user/logout/')
            clearUser()
            toast.success("Logged out")
            navigate('/user/login')
        } catch (err) {
            console.error('Logout Error', err)
        }
    }

    return { logout }
}