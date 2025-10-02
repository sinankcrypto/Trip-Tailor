import { useEffect, useState } from "react";
import { getAllAgencies } from "../services/agencyService";

export const useFetchAgencies = (initialParams = { page: 1, page_size: 10 }) => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState(initialParams);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  useEffect(() => {
    const fetchAgencies = async () => {
      setLoading(true);
      try {
        const data = await getAllAgencies(params);
        setAgencies(data.results || []);
        setPagination({
          count: data.count,
          next: data.next,
          previous: data.previous,
        });
      } catch (err) {
        console.error("failed to fetch agencies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgencies();
  }, [params]);

  return { agencies, loading, pagination, setParams, params };
};
