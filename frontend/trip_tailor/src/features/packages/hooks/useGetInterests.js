import { useEffect, useState } from "react";
import { getInterests } from "../services/packageService";

export const useGetInterests = () => {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const data = await getInterests();
        setInterests(data);
      } catch (err) {
        setError(err?.message || "Failed to load interests");
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, []);

  return { interests, loading, error };
};