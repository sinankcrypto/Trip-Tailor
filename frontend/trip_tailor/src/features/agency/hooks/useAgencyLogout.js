import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../../user/store/useUserStore'
import apiClient from '../../../api/apiClient'

const useAgencyLogout = () => {
    const navigate = useNavigate()
    const clearUser = useUserStore((state) => state.clearUser)

    const logout = async () => {
        try {
            await apiClient.post('/agency/logout/');
            
            clearUser();
            navigate('/user/login'); 
        } catch (err) {
        console.error("Logout failed", err);
        }
    };
    return logout
    
    }
  

export default useAgencyLogout
