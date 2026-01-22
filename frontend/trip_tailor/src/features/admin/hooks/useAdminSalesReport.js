import { useState } from "react";
import toast from "react-hot-toast";
import {
    fetchAdminSalesReport,
    downloadAdminSalesReportExcel,
    downloadAdminSalesReportPDF
} from "../services/adminDashboardService"
import triggerDownload from "../../../utils/fileDownload";

export const useAdminSalesReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchAdminSalesReport(params);
      setData(result);
    } catch (err) {
      setError(err);
      toast.error(
        err.response?.data?.detail ||
          "Failed to load sales report"
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (params = {}) => {
    try {
      setLoading(true);

      const blob = await downloadAdminSalesReportPDF(params);
      triggerDownload(blob, "sales_report.pdf");
    } catch (err) {
      toast.error("Failed to download PDF report");
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async (params = {}) => {
    try {
      setLoading(true);

      const blob = await downloadAdminSalesReportExcel(params);
      triggerDownload(blob, "sales_report.xlsx");
    } catch (err) {
      toast.error("Failed to download Excel report");
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    fetchReport,
    downloadPDF,
    downloadExcel,
  };
};