import { useState, useEffect } from "react";
import { fetchAgencyTransactions } from "../services/transactionService";

export const useFetchAgencyTransactions = (filters = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTransactions = async (params = {}) => {
    setLoading(true);
    try {
      const data = await fetchAgencyTransactions({ ...filters, ...params });
      setTransactions(data.results || []);
      setSummary(data.summary || {});
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [JSON.stringify(filters)]);

  return { transactions, summary, pagination, loading, error, loadTransactions };
};
