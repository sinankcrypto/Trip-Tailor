import { useNavigate } from "react-router-dom"
import apiClient from "../../../api/apiClient"


export const useAdminLogout = () => {
    const navigate = useNavigate()

    const logout = async () => {
        try{
            await apiClient.post('admin-panel/logout/')
        } catch (err) {
            console.error('Logout error:', err )
        } finally {
            navigate('/admin-panel/login')
        }
    }

    return { logout }
}