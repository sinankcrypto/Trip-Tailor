// src/features/bookings/pages/AgencyBookingsPage.jsx
import { useGetAgencyBookings } from "../hooks/useGetAgencyBookings";
import { updatePaymentStatus } from "../services/BookingService";
import { useUpdateBookingStatus } from "../hooks/useUpdateBookingStatus";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCancelBooking } from "../hooks/useCancelBooking";
import ConfirmModal from "../../../components/ConfirmModal";
import { useState } from "react";

const AgencyBookingsPage = () => {
  const { bookings, loading, error, refetch } = useGetAgencyBookings();
  const { mutate: updateBookingStatus, loading: statusLoading } = useUpdateBookingStatus();
  const navigate = useNavigate();
  const {handleCancel, loading: cancelLoading} = useCancelBooking();

  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const openCancelModal = (bookingId) => {
    setSelectedBooking(bookingId);
    setCancelReason("");
    setShowModal(true);
  };

  const confirmCancel = async () => {
    if (selectedBooking) {
      try{
        await handleCancel(selectedBooking, refetch,  {
          reason: cancelReason.trim() || undefined,
        });
      }
      catch (err) {

      }
      finally {
        setShowModal(false);
        setSelectedBooking(null);
        setCancelReason("");
      }  
    }
  };

  const handlePaymentStatusChange = async (id, status) => {
    try {
      await updatePaymentStatus(id, status);
      refetch();
      toast.success("Payment status updated");
    } catch (err) {
      toast.error("Failed to update payment status");
    }
  };

  const handleBookingStatusChange = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      refetch();
    } catch (err) {
      // Error already toasted in hook
    }
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Agency Bookings</h1>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 text-left text-sm font-medium text-gray-700">
            <tr>
              <th className="px-6 py-4">Package</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Members</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">{b.package_title}</td>
                <td className="px-6 py-4">{b.username}</td>
                <td className="px-6 py-4">{b.date}</td>
                <td className="px-6 py-4 text-center">{b.no_of_members}</td>
                <td className="px-6 py-4 font-semibold">₹{b.amount}</td>

                {/* Payment Status */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      b.payment_status === "PAID"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {b.payment_status}
                  </span>
                </td>

                {/* Booking Status */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      b.booking_status === "COMPLETED"
                        ? "bg-blue-100 text-blue-800"
                        : b.booking_status === "CANCELLED"
                        ? "bg-red-100 text-red-800"
                        : "bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    {b.booking_status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2 flex-wrap">

                    {/* Mark as Paid */}
                    {b.payment_status == "PENDING"  && (
                      <button
                        onClick={() => handlePaymentStatusChange(b.id, "PAID")}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                      >
                        Mark Paid
                      </button>
                    )}

                    {/* Complete Booking */}
                    {b.booking_status === "ACTIVE" &&
                      new Date().setHours(0, 0, 0, 0) >= new Date(b.date).setHours(0, 0, 0, 0) && (
                        <button
                          onClick={() => handleBookingStatusChange(b.id, "COMPLETED")}
                          disabled={statusLoading}
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 transition"
                        >
                          {statusLoading ? "Updating..." : "Mark Completed"}
                        </button>
                    )}

                    {b.booking_status === "ACTIVE" && (
                      new Date(b.date) > new Date().setHours(0, 0, 0, 0) && (
                      <button
                        disabled={cancelLoading}
                        onClick={() => openCancelModal(b.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                      >
                        {cancelLoading ? "Cancelling..." : "Cancel"}
                      </button>
                      )
                    )}

                    {/* Reopen Cancelled */}
                    {b.booking_status === "CANCELLED" && (
                      <button
                        onClick={() => handleBookingStatusChange(b.id, "ACTIVE")}
                        disabled={statusLoading}
                        className="px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50 transition"
                      >
                        Reopen
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/agency/bookings/${b.id}`)}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition"
                    >
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={showModal}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        showInput
        inputValue={cancelReason}
        onInputChange={setCancelReason}
        onConfirm={confirmCancel}
        onCancel={() => setShowModal(false)}
        confirmDisabled={cancelLoading}
      />
    </div>
  );
};

export default AgencyBookingsPage;