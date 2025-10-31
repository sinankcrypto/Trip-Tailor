import { useEffect, useState } from "react";
import {
  getAgencyPaymentSettings,
  connectStripe,
  disconnectStripe,
} from "../services/paymentService";

export const useAgencyPaymentSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getAgencyPaymentSettings();
      setSettings(data);
    } catch (err) {
      console.error("Payment settings fetch error:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to load payment settings."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setProcessing(true);
      const data = await connectStripe();
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe onboarding
      }
    } catch (err) {
      setError("Failed to connect with Stripe.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setProcessing(true);
      await disconnectStripe();
      await fetchSettings(); // refresh UI
    } catch (err) {
      setError("Failed to disconnect from Stripe.");
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    processing,
    handleConnect,
    handleDisconnect,
  };
};
