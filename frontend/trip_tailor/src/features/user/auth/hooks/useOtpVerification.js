import userApi from "../../../../api/userApi";

export const useOtpVerification = () => {
    const verifyOtp = async (email, otp) => {
        try{
            const res = await userApi.post('verify-otp/', { email, otp })
            return { success: true, message: res.data.message }
        } catch (err) {
            return { success: false, message: err.response?.data?.detail || "Error verifying OTP" }
        }
    }


    return { verifyOtp }
}