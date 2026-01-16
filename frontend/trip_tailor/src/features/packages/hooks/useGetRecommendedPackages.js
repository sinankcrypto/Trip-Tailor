import { useEffect, useState } from "react";
import { getRecommendedPackages } from "../services/packageService";

export const useGetRecommendedPackages = () => {
    const [packages, setPackages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchRecommended = async() => {
            try {
                const data = await getRecommendedPackages();
                setPackages(data)
            }
            catch(err){
                setError(err)
            }
            finally{
                setLoading(false)
            }
        }

        fetchRecommended();
    },[]);

    return { packages, loading, error};
};