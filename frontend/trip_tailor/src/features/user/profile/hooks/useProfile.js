import { useCallback, useEffect, useState } from "react";
import { getProfile, createProfile, updateProfile } from "../services/profileService";

export const useProfile = () =>{
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError]  = useState(null)
    const [notFound, setNotFound] = useState(false)

    const fetchProfile = useCallback(async () =>{
        setLoading(true)
        setError(null)
        setNotFound(false)
        try{
            const data = await getProfile()
            setProfile(data)
        } catch(err){
            if (err?.response?.status === 404){
                setNotFound(true)
                setProfile(null)
            } else {
                setError(err?.response?.data || "Failed to fetch profile")
            }
        } finally {
            setLoading(false)
        }
    },[])

    const saveProfile = useCallback(
        async (values) =>{
            setError(null)
            const action = profile?.id? updateProfile: createProfile
            const data = await action(values)
            setProfile(data)
            setNotFound(false)
            return data
        },
        [profile]
    );

    useEffect(() => {
        fetchProfile();
    },[fetchProfile])

    return { profile, loading, error, notFound, fetchProfile, saveProfile };
}