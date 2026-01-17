import { resetOtpVerify } from "../services/authService";
import { useState } from "react";

export const useResetVerifyOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verified, setVerified] = useState(false);

  const verifyOtp = async (email, otp) => {
    setLoading(true);
    setError(null);

    try {
      const res = await resetOtpVerify({ email, otp });
      setVerified(true);
      return {
        success: true,
        message: res?.message || "OTP verified successfully",
      };
    } catch (err) {
        const message =
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Invalid or expired OTP";

        setError(message);

        return {
          success: false,
          message,
        };
    } finally {
      setLoading(false);
    }
  };

  return {
    verifyOtp,
    loading,
    error,
    verified,
  };
};