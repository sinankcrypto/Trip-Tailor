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
      setBookings(data.results);
      setError(null);
    } catch (err) {
      if (err.response?.status === 403) {
          setError("Please wait till your profile is verified to continue services.");
        } else {
          setError("Failed to load bookings.");
        }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings };
};
