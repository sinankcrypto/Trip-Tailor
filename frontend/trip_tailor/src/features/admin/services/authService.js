import adminApi from "../../../api/adminApi"

export const loginAdmin = async (credentials) => {
    const response = await adminApi.post('login/', credentials)
    return response.data
}