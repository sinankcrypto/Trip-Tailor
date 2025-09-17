import { use, useState } from "react"
import { toggleList } from "../services/packageService"

export const useToggleList = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleToggle = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const data = await toggleList(id);
            return data;
        } catch (err) {
            setError(err.response?.data || "Failed to toggle list status");
            throw err;
        } finally {
            setLoading(false)
        }
    };

    return { handleToggle, loading, error   }
}