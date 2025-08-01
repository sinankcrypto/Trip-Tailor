import { useNavigate } from "react-router-dom"
import adminApi from "../../../api/adminApi"


export const useAdminLogout = () => {
    const navigate = useNavigate()

    const logout = async () => {
        try{
            await adminApi.post('logout/')
        } catch (err) {
            console.error('Logout error:', err )
        } finally {
            navigate('/admin-panel/login')
        }
    }

    return { logout }
}