import apiClient from "../../../api/apiClient";

export const getAgencyPaymentSettings = async () => {
  const res = await apiClient.get("/payments/agency/payment-settings/");
  return res.data;
};

export const connectStripe = async () => {
  const res = await apiClient.post("/payments/agency/payment-settings/connect/");
  return res.data;
};

export const disconnectStripe = async () => {
  const res = await apiClient.post("/payments/agency/payment-settings/disconnect/");
  return res.data;
};