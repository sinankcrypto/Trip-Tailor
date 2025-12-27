import { createReview } from "../services/reviewService";
import { useState } from "react";
import toast from "react-hot-toast";

const useAddReview = () => {
  const [loading, setLoading] = useState(false);

  const addReview = async (data) => {
    try {
      setLoading(true);
      await createReview(data);
      toast.success("Review submitted successfully");
    } catch (err) {
      toast.error(
        err?.response?.data?.detail ||
        err?.response?.data?.non_field_errors?.[0] ||
        "Failed to submit review"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addReview, loading };
};

export default useAddReview;