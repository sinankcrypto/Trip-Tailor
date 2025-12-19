import { useEffect, useState } from "react";
import { getAgencyDashboardMetrics } from "../services/agencyDashboardService";

export const useAgencyDashboardMetrics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const result = await getAgencyDashboardMetrics();
        setData(result);
      } catch (err) {
        console.error("Agency dashboard metrics error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return { data, loading, error };
};