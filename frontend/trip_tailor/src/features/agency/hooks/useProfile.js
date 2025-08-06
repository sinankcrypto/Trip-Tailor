import { use, useEffect, useState } from "react";
import agencyApi from "../../../api/agencyApi";
import adminApi from "../../../api/adminApi";

export const useProfile = () => {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchProfile = async () => {
        try{
            const res = await agencyApi.get('/profile/')
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
            const res = await agencyApi.put('/profile/', updatedData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setProfile(res.data)
            return true
        } catch (err) {
            console.error('Profile update failed', err)
            return false
        }
    }

    useEffect(() => {
        fetchProfile();
    },[])

    return { profile, loading, updateProfile };
}