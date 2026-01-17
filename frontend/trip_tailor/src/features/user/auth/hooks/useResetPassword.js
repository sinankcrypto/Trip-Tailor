import { resetPassword } from "../services/authService";
import { useState } from "react";

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const resetPassword = async (
    email,
    newPassword,
    confirmPassword
  ) => {
    setLoading(true);
    setError(null);

    try {
      await resetPasswordService({
        email,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setSuccess(true);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    resetPassword,
    loading,
    error,
    success,
  };
};