import { useEffect, useState } from "react"
import { getMyPackages } from "../services/packageService"
import { FiActivity } from "react-icons/fi"

export const useGetMyPackages = () => {
    const [packages, setPackages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data = await getMyPackages();
                setPackages(data);
            } catch (err) {
                if (err.response?.status === 403) {
                setError("Please wait till your profile is verified to continue services.");
                }else{
                setError(err.response?.data || "Failed to fetch packages")
                }

            } finally {
                setLoading(false)
            }
        };

        fetchPackages()
    },[]);

    return { packages, setPackages, loading, error}
}