import { useState } from "react";
import { verifyAgency, rejectAgency } from "../services/agencyService";
import toast from "react-hot-toast";

export const useAgencyActions = () => {
  const [loading, setLoading] = useState(false);

  const handleVerify = async (id) => {
    setLoading(true);
    try {
      const data = await verifyAgency(id);
      toast.success("Agency verified successfully!");
      return data;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Failed to verify agency");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id, reason) => {
    setLoading(true);
    try {
      const data = await rejectAgency(id, reason);
      toast.success("Agency rejected successfully!");
      return data;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Failed to reject agency");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleVerify, handleReject, loading };
};
