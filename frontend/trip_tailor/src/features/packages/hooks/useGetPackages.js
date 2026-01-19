// src/features/packages/hooks/useGetPackages.js
import { useState, useEffect } from "react";
import { getPackages } from "../services/packageService";

export const useGetPackages = (filters = {}) => {
  const [packages, setPackages] = useState([]);
  const [pagination, setPagination] = useState({ next: null, previous: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await getPackages(filters);
      console.log(filters)
      setPackages(data.results || data);
      setPagination({ next: data.next, previous: data.previous });
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [JSON.stringify(filters)]); // re-run when filters change

  return { packages, pagination, loading, error };
};
