import apiClient from "../../../../api/apiClient";

export const useOtpVerification = () => {
    const verifyOtp = async (email, otp) => {
        try{
            const res = await apiClient.post('/user/verify-otp/', { email, otp })
            return { success: true, message: res.data.message }
        } catch (err) {
            return { success: false, message: err.response?.data?.detail || "Error verifying OTP" }
        }
    }


    return { verifyOtp }
}