import { useEffect, useState } from "react";
import { fetchAdminDashboardMetrics } from "../services/adminDashboardService";
import toast from "react-hot-toast";

export const useAdminDashboardMetrics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchAdminDashboardMetrics();
      setData(result);
    } catch (err) {
      setError(err);
      toast.error(
        err.response?.data?.detail ||
          "Failed to load dashboard metrics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: loadMetrics,
  };
};