import apiClient from "../../../api/apiClient";

export const getAllUsers = async (params = {}) => {
    const response = await apiClient.get('admin-panel/users/',{params});
    return response.data;
};