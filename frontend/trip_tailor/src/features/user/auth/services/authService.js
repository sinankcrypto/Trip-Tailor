import apiClient from "../../../../api/apiClient";

export const signupUser = async (formData) => {
    try{
        const response = await apiClient.post('/user/signup/', formData)
        return response.data
    } catch (error){
        throw error;
    }   
}

export const loginUser = async (credentials) => {
    const response = await apiClient.post('/user/login/',credentials)
    return response.data
}

export const verifyOtp = async (email, otp) => {
    const response = await apiClient.post("/user/verify-otp/", {email, otp})
    return response.data
}