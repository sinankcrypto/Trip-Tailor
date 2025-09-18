// src/features/bookings/hooks/useGetAgencyBookings.js
import { useEffect, useState, useCallback } from "react";
import { getAgencyBookings } from "../services/BookingService";

export const useGetAgencyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAgencyBookings();
      setBookings(data);
      setError(null);
    } catch (err) {
      setError("Failed to load agency bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings };
};
