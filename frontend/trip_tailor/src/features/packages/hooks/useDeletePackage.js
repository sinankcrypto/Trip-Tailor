import { useState } from "react"
import { deletePackage } from "../services/packageService"

export const useDeletePackage = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleDelete = async (id) => {
        setLoading(true)
        setError(null)
        try {
            const data = await deletePackage(id)
            return data;
        } catch (err) {
            setError(err.response?.data || "Failed to delete package");
            throw err;
        } finally {
            setLoading(false)
        }
    };
    return { handleDelete, loading, error};
};