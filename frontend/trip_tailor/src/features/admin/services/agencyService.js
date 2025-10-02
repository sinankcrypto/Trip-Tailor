import apiClient from "../../../api/apiClient";

export const getAllAgencies = async (params = {}) => {
    const response = await apiClient.get('admin-panel/agencies/',{params});
    return response.data;
}

export const verifyAgency = async (id) => {
    const response = await apiClient.post(`admin-panel/agencies/${id}/verify`)
    return response.data;
};

export const rejectAgency = async(id, reason) => {
    const response = await apiClient.post(`admin-panel/agencies/${id}/reject`, {reason});
    return response.data;
};