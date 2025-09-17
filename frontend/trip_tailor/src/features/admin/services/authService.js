import apiClient from "../../../api/apiClient"

export const loginAdmin = async (credentials) => {
    const response = await apiClient.post('admin-panel/login/', credentials)
    return response.data
}