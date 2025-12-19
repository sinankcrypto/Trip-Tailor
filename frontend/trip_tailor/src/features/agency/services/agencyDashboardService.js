import apiClient from "../../../api/apiClient";

export const getAgencyDashboardMetrics = async () => {
  const response = await apiClient.get(
    "agency/dashboard/metrics/",
  );

  return response.data;
};