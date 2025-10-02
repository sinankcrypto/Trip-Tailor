import { useState } from "react"
import { createPackage } from "../services/packageService"

export const useCreatePackage = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleCreate = async (FormData) => {
        setLoading(true)
        setError(null)
        try {
            const data = await createPackage(FormData);
            return data;
        } catch (err) {
            setError(err.response?.data || "Failed to create package")
            throw err;
        } finally {
            setLoading(false);
        }
    };
    return { handleCreate, loading, error};
};