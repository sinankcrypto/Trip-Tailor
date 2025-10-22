import { useParams, useNavigate } from "react-router-dom";
import { useGetBooking } from "../hooks/useGetBooking";
import { ArrowLeft } from "lucide-react";

const AgencyBookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { booking, loading, error } = useGetBooking(id);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading booking details...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );

  if (!booking)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Booking not found.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-indigo-600 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Back
      </button>

      {/* Header */}
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Booking Details
      </h1>

      {/* Booking Info */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div className="flex justify-between">
          <p className="text-gray-700 font-medium">Booking ID:</p>
          <p className="text-gray-900">{booking.id}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-gray-700 font-medium">Package:</p>
          <p className="text-gray-900">{booking.package_title}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-gray-700 font-medium">Status:</p>
          <p
            className={`font-semibold ${
              booking.booking_status === "COMPLETED"
                ? "text-green-600"
                : booking.booking_status === "ACTIVE"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {booking.booking_status}
          </p>
        </div>

        <div className="flex justify-between">
          <p className="text-gray-700 font-medium">Booked On:</p>
          <p className="text-gray-900">
            {new Date(booking.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex justify-between">
          <p className="text-gray-700 font-medium">Total Price:</p>
          <p className="text-gray-900">₹{booking.amount}</p>
        </div>
      </div>

      {/* User Info */}
      <h2 className="text-xl font-semibold mt-10 mb-4 text-gray-800">
        User Details
      </h2>
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div className="flex justify-between">
          <p className="text-gray-700 font-medium">Name:</p>
          <p className="text-gray-900">{booking.username}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-gray-700 font-medium">Email:</p>
          <p className="text-gray-900">{booking.user_email}</p>
        </div>
      </div>
    </div>
  );
};

export default AgencyBookingDetailsPage;
