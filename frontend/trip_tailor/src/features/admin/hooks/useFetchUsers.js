import { useEffect, useState } from "react";
import { getAllUsers } from "../services/userService";

export const useFetchUsers = (initialParams = { page: 1, page_size: 10 }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState(initialParams);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getAllUsers(params);
        setUsers(data.results || []);
        setPagination({
          count: data.count,
          next: data.next,
          previous: data.previous,
        });
      } catch (err) {
        console.error("failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [params]);

  return { users, loading, pagination, setParams, params };
};
