import { useEffect, useState, useCallback } from "react";
import { getPackageReviews } from "../services/reviewService";
import apiClient from "../../../api/apiClient";

export const useGetPackageReviews = (packageId) => {
  const [reviews, setReviews] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(
    async (url = null) => {
      try {
        setLoading(true);
        setError(null);

        const response = url
          ? await apiClient.get(url)
          : await getPackageReviews(packageId);

        const data = response.data ?? response;

        setReviews((prev) =>
          url ? [...prev, ...data.results] : data.results
        );

        setNextUrl(data.next);
      } catch (err) {
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    },
    [packageId]
  );

  // Initial fetch when packageId changes
  useEffect(() => {
    if (!packageId) return;

    setReviews([]);
    setNextUrl(null);
    fetchReviews();
  }, [packageId, fetchReviews]);

  const loadMore = () => {
    if (nextUrl && !loading) {
      fetchReviews(nextUrl);
    }
  };

  return {
    reviews,
    loading,
    error,
    loadMore,
    hasMore: Boolean(nextUrl),
  };
};
