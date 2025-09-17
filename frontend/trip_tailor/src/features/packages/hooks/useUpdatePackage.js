import { useState } from "react"
import { updatePackage } from "../services/packageService";

export const useUpdatePackage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleUpdate = async (id, formData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await updatePackage(id, formData);
            return data
        } catch (err) {
            setError(err.response?.data || "Failed to update package");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {handleUpdate, loading, error};
};