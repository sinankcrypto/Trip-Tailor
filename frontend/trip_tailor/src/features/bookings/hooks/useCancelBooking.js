import { useState } from "react"
import { cancelBooking } from "../services/BookingService";
import { FiActivity } from "react-icons/fi";

export const useCancelBooking = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const handleCancel = async (bookingId, refetch) => {
        setLoading(true)
        setError(null)
        try{
            const data = await cancelBooking(bookingId);
            if (refetch) refetch()
            return data;
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to cancel booking");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { handleCancel, loading };
};