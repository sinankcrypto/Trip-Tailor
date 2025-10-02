import { useState, useEffect } from "react"
import { getPackage } from "../services/packageService";

export const useGetOnePackage = (id) => {
    const [pkg, setPackage] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    let cancelled = false;
    const fetchPackage = async (id) => {
        try {
        setLoading(true);
        const data = await getPackage(id);
        if (!cancelled) setPackage(data);
        } catch (err) {
        if (!cancelled) setError(err.response?.data || err.message);
        } finally {
        if (!cancelled) setLoading(false);
        }
    };
    fetchPackage(id);
    return () => (cancelled = true);
    }, []);

    return { pkg, loading, error };
}