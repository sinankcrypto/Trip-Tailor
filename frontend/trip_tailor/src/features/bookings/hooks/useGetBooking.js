import { useEffect, useState } from "react";
import { getBookingById } from "../services/BookingService";

export const useGetBooking = (id) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(id);
        setBooking(data);
      } catch (err) {
        setError("Failed to load booking");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  return { booking, loading, error };
};
