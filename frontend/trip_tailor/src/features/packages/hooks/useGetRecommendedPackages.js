import { useEffect, useState } from "react";
import { getRecommendedPackages } from "../services/packageService";

export const useGetRecommendedPackages = (refetchKey = 0) => {
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
    },[refetchKey]);

    return { packages, loading, error};
};