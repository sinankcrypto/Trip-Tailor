import { useEffect, useState } from "react";
import { getBookings } from "../services/BookingService";


export const useGetUserBookings = (initialParams = {}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({count:0, next: null, previous: null});
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    ordering: null,
    filters: {},
    ...initialParams,
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getBookings(params);
      setBookings(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
      setError(null);
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [params]);

  return { bookings, loading, error, pagination, setParams, refetch: fetchBookings };
};