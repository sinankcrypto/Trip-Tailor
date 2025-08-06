import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../../user/store/useUserStore'
import agencyApi from '../../../api/agencyApi'

const useAgencyLogout = () => {
    const navigate = useNavigate()
    const clearUser = useUserStore((state) => state.clearUser)

    const logout = async () => {
        try {
            await agencyApi.post('/logout/');
            
            clearUser();
            navigate('/user/login'); 
        } catch (err) {
        console.error("Logout failed", err);
        }
    };
    return logout
    
    }
  

export default useAgencyLogout
