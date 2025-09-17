// src/features/packages/hooks/useGetPackages.js
import { useState, useEffect } from "react";
import { getPackages } from "../services/packageService";

export const useGetPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await getPackages();
        if (!cancelled) setPackages(data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data || err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchPackages();
    return () => (cancelled = true);
  }, []);

  return { packages, loading, error };
};
