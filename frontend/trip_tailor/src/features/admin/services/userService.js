import apiClient from "../../../api/apiClient";

export const getAllUsers = async () => {
    const response = await apiClient.get('admin-panel/users/');
    return response.data;
};