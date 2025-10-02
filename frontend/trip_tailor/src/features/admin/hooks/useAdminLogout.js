import { useNavigate } from "react-router-dom"
import apiClient from "../../../api/apiClient"
import toast from "react-hot-toast"
import { logoutAdmin } from "../services/authService"


export const useAdminLogout = () => {
    const navigate = useNavigate()

    const logout = async () => {
        try{
            await logoutAdmin()
            toast.success("Logged out")
        } catch (err) {
            console.error('Logout error:', err )
        } finally {
            navigate('/admin-panel/login')
        }
    }

    return { logout }
}