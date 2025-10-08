// pages/UserBookingsPage.jsx
import React, { useState } from "react";
import { useGetUserBookings } from "../hooks/useGetUserBookings";
import { useCancelBooking } from "../hooks/useCancelBooking";
import ConfirmModal from "../../../components/ConfirmModal";

const UserBookingsPage = () => {
  const { bookings, loading, error, pagination, setParams, refetch } = useGetUserBookings();
  const { handleCancel, loading: cancelLoading } = useCancelBooking();

  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const openCancelModal = (bookingId) => {
    setSelectedBooking(bookingId)
    setShowModal(true);
  };

  const confirmCancel = async () => {
    if(selectedBooking){
        await handleCancel(selectedBooking, refetch)
        setShowModal(false)
        setSelectedBooking(null)
    }
  };

  const handlePageChange = (page) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const handleSortChange = (ordering) => {
    setParams((prev) => ({ ...prev, ordering }));
  };

  const handleFilterChange = (filters) => {
    setParams((prev) => ({ ...prev, filters, page: 1 }));
  };

  if (loading) return <p className="p-6 text-gray-600">Loading your bookings...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-600 rounded-full">Upcoming</span>;
      case "completed":
        return <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-600 rounded-full">Completed</span>;
      case "cancelled":
        return <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-600 rounded-full">Cancelled</span>;
      default:
        return <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Your Bookings</h2>

        {/* Sort & Filters */}
        <div className="flex space-x-3">
          <select
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
          >
            <option value="">Sort by</option>
            <option value="date">Date ↑</option>
            <option value="-date">Date ↓</option>
            <option value="amount">Price ↑</option>
            <option value="-amount">Price ↓</option>
          </select>

          <div className="flex space-x-2">
            <button
              onClick={() => handleFilterChange({ booking_status: "ACTIVE" })}
              className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100"
            >
              Upcoming
            </button>
            <button
              onClick={() => handleFilterChange({ booking_status: "COMPLETED" })}
              className="px-3 py-2 bg-green-50 text-green-600 rounded-lg text-sm hover:bg-green-100"
            >
              Completed
            </button>
            <button
              onClick={() => handleFilterChange({ booking_status: "CANCELLED" })}
              className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100"
            >
              Cancelled
            </button>
            <button
              onClick={() => handleFilterChange({})}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="grid gap-4">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-between border border-gray-200 rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition"
          >
            <div>
              <div className="mt-2">{getStatusLabel(b.booking_status)}</div>
              <h3 className="text-lg font-medium text-gray-800">{b.package_title}</h3>
              <p className="text-sm text-gray-500">Date: {b.date}</p>
              <p className="text-sm text-gray-500">Price: ₹{b.amount}</p>
              <div className="mt-2">{getStatusLabel(b.payment_status)}</div>
            </div>

            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                onClick={() => alert(`Booking details for ${b.id}`)}
              >
                Details
              </button>

              {b.booking_status === "ACTIVE" && (
                <button
                  disabled={cancelLoading}
                  onClick={() => openCancelModal(b.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <p className="text-gray-500 text-center py-6">No bookings found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          disabled={!pagination.previous}
          onClick={() => handlePageChange(pagination.previous ? pagination.previous.page : 1)}
          className={`px-4 py-2 rounded-lg text-sm ${
            pagination.previous
              ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Previous
        </button>
        <p className="text-gray-600 text-sm">Total: {pagination.count}</p>
        <button
          disabled={!pagination.next}
          onClick={() => handlePageChange(pagination.next ? pagination.next.page : 1)}
          className={`px-4 py-2 rounded-lg text-sm ${
            pagination.next
              ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>

      <ConfirmModal
        isOpen={showModal}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        onConfirm={confirmCancel}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
};

export default UserBookingsPage;
