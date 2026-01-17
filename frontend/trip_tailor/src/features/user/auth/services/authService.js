import apiClient from "../../../../api/apiClient";

export const signupUser = async (formData) => {
    const response = await apiClient.post('/user/signup/', formData)
    return response.data
      
}

export const loginUser = async (credentials) => {
    const response = await apiClient.post('/user/login/',credentials)
    return response.data
}

export const sendOtp = async (email) => {
  try {
    const response = await apiClient.post('/user/send-otp/', { email });

    // 200 → OTP sent/resent successfully
    return {
      success: true,
      message: response.data.detail || 'OTP sent successfully!',
    };
  } catch (err) {
    const res = err.response;
    let message = 'Failed to resend OTP';

    // 429 = rate limited → show the exact backend message (user-friendly)
    if (res?.status === 429 || res?.status === 400) {
      message = res.data?.detail || res.data?.message || 'Please wait before resending.';
    } else if (res?.data?.detail) {
      message = res.data.detail;
    }

    // IMPORTANT: on 429 we still return success: false but with the correct message
    return { success: false, message };
  }
};

export const verifyOtp = async (email, otp) => {
    const response = await apiClient.post("/user/verify-otp/", {email, otp})
    return response.data
}

export const forgotPassword = async (email) => {
  const response = await apiClient.post("user/forgot-password/", {email})
  return response.data
}

export const resetOtpVerify = async ({email, otp}) => {
  const response = await apiClient.post("user/reset-verify-otp/", {email, otp});
  return response.data;
}

export const resetPassword = async ({email, new_password, confirm_password}) => {
  const response = await apiClient.post("user/reset-password/", 
    {
      email, new_password, confirm_password,
    });
    return response.data;
}