import apiClient from "../../../api/apiClient";

export const createReview = async (payload) => {
  const res = await apiClient.post("/reviews/", payload);
  return res.data;
};

export const getPackageReviews = async (packageId, page = 1) => {
  const res = await apiClient.get(
    `/reviews/?package_id=${packageId}&page=${page}`
  );
  return res.data;
};