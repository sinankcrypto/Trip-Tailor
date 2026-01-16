import { createUserInterests } from "../services/profileService";
import { useState } from "react";

export const useCreateUserInterests = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitInterests = async (interestIds) => {
    setLoading(true);
    setError(null);

    try {
      const data = await createUserInterests({
        interest_ids: interestIds,
      });
      return data;
    } catch (err) {
      // Store raw backend error for UI
      setError(err.response?.data || err.message || "Something went wrong");
      throw err; // allow page to decide UX
    } finally {
      setLoading(false);
    }
  };

  return {
    submitInterests,
    loading,
    error,
  };
};