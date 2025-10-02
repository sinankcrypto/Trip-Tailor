import { use, useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";

export const useProfile = () => {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchProfile = async () => {
        try{
            const res = await apiClient.get('/agency/profile/')
            setProfile(res.data)
            console.log(res.data)
        } catch (err) {
            console.error('Failed to load profile')
        } finally {
            setLoading(false)
        }
    }

    const updateProfile = async (updatedData) => {
        try{
            const res = await apiClient.put('/agency/profile/', updatedData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setProfile(res.data)
        } catch (err) {
            throw err
        }
    }

    useEffect(() => {
        fetchProfile();
    },[])

    return { profile, loading, updateProfile };
}