import apiClient from "../../../api/apiClient";

export const getAllAgencies = async () => {
    const response = await apiClient.get('admin-panel/agencies/')
    return response.data;
}