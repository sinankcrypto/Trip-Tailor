import { useState } from "react"
import { createBooking } from "../services/BookingService"

export const useCreateBooking = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleCreate = async (payload) => {
        try {
            setLoading(true)
            setError(null)
            const data = await createBooking(payload)
            return data
        } catch (err) {
            setError(err.response?.data || "Booking failed");
            throw err;
        } finally {
            setLoading(false);
        }
    }
    return {handleCreate, loading, error }
}