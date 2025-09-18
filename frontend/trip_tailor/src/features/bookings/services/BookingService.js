import apiClient from "../../../api/apiClient";

export const createBooking = async (payload) => {
  const res = await apiClient.post("/bookings", payload);
  return res.data;
};

export const getAgencyBookings = async () => {
  const res = await apiClient.get("/agency/bookings");
  return res.data;
};

export const updateBookingStatus = async (id, status) => {
  const res = await apiClient.patch(`/agency/bookings/${id}/status`, { payment_status: status });
  return res.data;
};

export const getBookingById = async (id) => {
    const res = await apiClient.get(`/bookings/${id}`);
    return res.data;
}
