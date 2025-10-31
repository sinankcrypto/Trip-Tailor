import { Search } from "lucide-react";
import apiClient from "../../../api/apiClient";


export const fetchAdminTransactions = async (params={}) => {
  const res = await apiClient.get("/payments/admin/transactions/", { params });
  return res.data;
};

export const fetchAgencyTransactions = async (params={}) => {
    const res = await apiClient.get("/payments/agency/transactions/",{params});
    return res.data;
}

export const fetchUserTransactions = async (params={}) => {
    const res = await apiClient.get("payments/user/transactions/",{ params });
    return res.data;
}