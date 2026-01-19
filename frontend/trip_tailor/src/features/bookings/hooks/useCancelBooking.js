import { useState } from "react"
import { cancelBooking } from "../services/BookingService";
import toast from "react-hot-toast";
import { FiActivity } from "react-icons/fi";

export const useCancelBooking = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const handleCancel = async (bookingId, refetch) => {
        setLoading(true)
        setError(null)
        try {
            const data = await cancelBooking(bookingId);

            // On success
            toast.success("Booking cancelled successfully");
            
            if (refetch) refetch();
            return data;
            } catch (err) {
            // Extract meaningful message from backend
            const message =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                err.message ||
                "Failed to cancel booking";

            toast.error(message); // Show actual backend error to user
            throw err; // Re-throw so component can handle if needed
            } finally {
            setLoading(false);
            }
    };

    return { handleCancel, loading };
};