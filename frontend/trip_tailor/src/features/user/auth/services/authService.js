import { resolvePath } from "react-router-dom";
import userApi from "../../../../api/userApi";

export const signupUser = async (formData) => {
    try{
        const response = await userApi.post('/signup/', formData)
        return response.data
    } catch (error){
        throw error;
    }   
}

export const loginUser = async (credentials) => {
    const response = await userApi.post('/login/',credentials)
    return response.data
}

export const verifyOtp = async (email, otp) => {
    const response = await userApi.post("/verify-otp/", {email, otp})
    return response.data
}