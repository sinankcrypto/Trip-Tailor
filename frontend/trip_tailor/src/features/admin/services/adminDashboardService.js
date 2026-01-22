import apiClient from "../../../api/apiClient";

export const fetchAdminDashboardMetrics = async() => {
    const response = await apiClient.get("admin-panel/dashboard/metrics/")
    return response.data;
};

export const fetchAdminSalesReport = async(params = {}) => {
    const response = await apiClient.get("admin-panel/sales-report/", { params });
    return response.data;
};

export const downloadAdminSalesReportPDF = async (params = {}) => {
    const response = await apiClient.get(
        "admin-panel/sales-report/export/pdf/",{ params, responseType: "blob", }
    );
    return response.data;
}

export const downloadAdminSalesReportExcel = async (params = {}) => {
    const response = await apiClient.get(
        "admin-panel/sales-report/export/excel/",{ params, responseType: "blob", }
    );
    return response.data
}