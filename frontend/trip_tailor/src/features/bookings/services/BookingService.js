import apiClient from "../../../api/apiClient";

export const createBooking = async (payload) => {
  const res = await apiClient.post("/bookings", payload);
  return res.data;
};

export const updatePaymentStatus = async (id, status) => {
  const res = await apiClient.patch(`/bookings/${id}/update-payment-status`, { payment_status: status });
  return res.data;
};

export const updateBookingStatus = async (id, status) => {
  const res = await apiClient.patch(`/bookings/${id}/update-status`,{booking_status: status});
  return res.data
}

export const getBookingById = async (id) => {
    const res = await apiClient.get(`/bookings/${id}`);
    return res.data;
}

export const getBookings = async ({ page =1, pageSize = 10, ordering = null, filters = {}} = {}) => {
  const params = { page, page_size : pageSize, ...filters };

  if (ordering) {
    params.ordering = ordering
  }
  const response = await apiClient.get("/bookings", {params});
  return response.data;
};

export const cancelBooking = async (bookingId, payload) => {
  const response = await apiClient.post(`bookings/${bookingId}/cancel`, payload);
  return response.data;
};

export const createCheckoutSession = async (bookingId) => {
  const res = await apiClient.post(`/payments/create-checkout-session/`, {
    "booking_id": bookingId,
  });
  
  return res.data
}