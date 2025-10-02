import { useState } from "react"
import { useEffect } from "react";
import { getAllBookings } from "../services/BookingService";


export const useGetAllBookings = (params = {}) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await getAllBookings(params); 
      setBookings(response.results || response); 
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [JSON.stringify(params)]); // re-fetch if params change

  return { bookings, loading, error, refetch: fetchBookings };

}