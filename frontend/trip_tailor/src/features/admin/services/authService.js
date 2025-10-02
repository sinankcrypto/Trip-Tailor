import apiClient from "../../../api/apiClient"

export const loginAdmin = async (credentials) => {
    const response = await apiClient.post('admin-panel/login/', credentials)
    return response.data
}

export const logoutAdmin = async () => {
    const response = await apiClient.post('admin-panel/logout/')
    return response.data
}