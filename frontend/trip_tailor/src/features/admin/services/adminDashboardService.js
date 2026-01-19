import apiClient from "../../../api/apiClient";

export const fetchAdminDashboardMetrics = async() => {
    const response = await apiClient.get("admin-panel/dashboard/metrics/")
    return response.data;
};