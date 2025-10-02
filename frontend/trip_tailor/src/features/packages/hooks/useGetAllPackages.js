// src/features/packages/hooks/useGetAllPackages.js
import { useEffect, useState } from "react";
import { getAllPackages } from "../services/packageService";

export const useGetAllPackages = (filters) => {
  const [packages, setPackages] = useState([]);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    page: filters?.page || 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const data = await getAllPackages(filters);

        setPackages(data.results);

        // derive pagination info
        const totalPages = Math.ceil(data.count / (filters.page_size || 10));

        setPagination({
          count: data.count,
          next: data.next,
          previous: data.previous,
          page: filters.page || 1,
          totalPages,
        });

        setError(null);
      } catch (err) {
        setError("Failed to load packages");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [filters]);

  return { packages, pagination, loading, error };
};
