import { useEffect, useState, useTransition } from "react";
import { getAllAgencies } from "../services/agencyService";

export const useFetchAgencies = () => {
    const [agencies, setAgencies] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAgencies = async () => {
            try{
                const data = await getAllAgencies();
                setAgencies(data)
                console.log(data)
            } catch (err) {
                console.log('failed to fetch users:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchAgencies();
    },[])

    return { agencies, loading}
}