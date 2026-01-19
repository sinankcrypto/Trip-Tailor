import { forgotPassword } from "../services/authService";
import { useState } from "react";

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const sendOtp = async (email) => {
    setLoading(true);
    setError(null);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    sendOtp,
    loading,
    error,
    success,
  };
};