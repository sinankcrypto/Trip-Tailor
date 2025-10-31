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

export const getUserBookings = async ({ page =1, pageSize = 10, ordering = null, filters = {}} = {}) => {
  const params = { page, page_size : pageSize, ...filters };

  if (ordering) {
    params.ordering = ordering
  }
  const response = await apiClient.get("/user/bookings/", {params});
  return response.data;
};

export const getAllBookings = async () => {
  const response = await apiClient.get("admin-panel/bookings/")
  return response.data;
}

export const cancelBooking = async (bookingId) => {
  const response = await apiClient.post(`bookings/${bookingId}/cancel/`);
  return response.data;
};

export const createCheckoutSession = async (bookingId) => {
  const res = await apiClient.post(`/payments/create-checkout-session/`, {
    booking_id: bookingId,
  });
  
  return res.data
}