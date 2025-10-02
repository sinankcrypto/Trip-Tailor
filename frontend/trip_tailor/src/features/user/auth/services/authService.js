import apiClient from "../../../../api/apiClient";

export const signupUser = async (formData) => {
    const response = await apiClient.post('/user/signup/', formData)
    return response.data
      
}

export const loginUser = async (credentials) => {
    const response = await apiClient.post('/user/login/',credentials)
    return response.data
}

export const verifyOtp = async (email, otp) => {
    const response = await apiClient.post("/user/verify-otp/", {email, otp})
    return response.data
}