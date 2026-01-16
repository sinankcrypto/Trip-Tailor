import { getUserInterests } from "../services/profileService";
import { useState, useEffect } from "react";

export const useGetUserInterests = (enabled = true) => {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const fetchInterests = async () => {
      try {
        const data = await getUserInterests();
        setInterests(data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, [enabled]);

  return {
    interests,
    hasInterests: interests.length > 0,
    loading,
    error,
  };
};