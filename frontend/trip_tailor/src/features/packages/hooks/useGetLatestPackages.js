import { useEffect, useState } from "react";
import { getLatestPackages } from "../services/packageService";


export const useGetLatestPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const data = await getLatestPackages();
        setPackages(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  return { packages, loading, error };
};
