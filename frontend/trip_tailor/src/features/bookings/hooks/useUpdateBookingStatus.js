// src/features/bookings/hooks/useUpdateBookingStatus.js
import { useState } from "react";
import { updateBookingStatus } from "../services/BookingService";
import toast from "react-hot-toast";

export const useUpdateBookingStatus = () => {
  const [loading, setLoading] = useState(false);

  const mutate = async (id, status) => {
    setLoading(true);
    try {
      const data = await updateBookingStatus(id, status);
      toast.success("Booking status updated successfully");
      return data;
    } catch (err) {
      const message =
        err.response?.data?.booking_status?.[0] ||
        err.response?.data?.detail ||
        "Failed to update booking status";
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading };
};