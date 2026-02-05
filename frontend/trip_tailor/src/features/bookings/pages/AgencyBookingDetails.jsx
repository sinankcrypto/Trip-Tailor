import { useParams, useNavigate } from "react-router-dom";
import { useGetBooking } from "../hooks/useGetBooking";
import { ArrowLeft, BookKey } from "lucide-react";

const AgencyBookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { booking, loading, error } = useGetBooking(id);

  const formatCancelledBy = (value) => {
    if (!value) return "—";

    switch (value.toLowerCase()) {
      case "user":
        return "User";
      case "agency":
        return "Agency";
      case "admin":
      case "staff":
        return "Admin";
      default:
        return value;
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

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
          <p className="text-gray-700 font-medium">Booking Sl No:</p>
          <p className="text-gray-900">{booking.id}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-gray-700 font-medium">Package:</p>
          <p className="text-gray-900">{booking.package_title}</p>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <p className="text-gray-700 font-medium">Members:</p>
            <p className="text-gray-900">
              {booking.adults} Adults
              {booking.kids > 0 && `, ${booking.kids} Kids`}
            </p>
          </div>

          <div className="flex justify-between">
            <p className="text-gray-700 font-medium">Booking Date:</p>
            <p className="text-gray-900">
              {formatDate(booking.date)}
            </p>
          </div>

          <div className="flex justify-between">
            <p className="text-gray-700 font-medium">Package Duration:</p>
            <p className="text-gray-900">
              {booking.package_duration} days
            </p>
          </div>
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

        {booking.booking_status === "CANCELLED" && (
          <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-lg space-y-2">
            <h4 className="text-sm font-semibold text-red-700">
              Cancellation Details
            </h4>

            {/* Cancelled By */}
            <div className="flex justify-between">
              <p className="text-gray-700 font-medium">Cancelled By:</p>
              <p className="text-gray-900">
                {formatCancelledBy(booking.cancelled_by)}
              </p>
            </div>

            {/* Reason */}
            <div className="flex justify-between">
              <p className="text-gray-700 font-medium">Reason:</p>
              <p className="text-gray-900 max-w-xs text-right">
                {booking.cancellation_reason || "Not provided"}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <p className="text-gray-700 font-medium">Booked On:</p>
          <p className="text-gray-900">
            {formatDate(booking.created_at)}
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

        {booking.profile_completed && booking.user_profile && (
          <>
            {/* Full Name */}
            <div className="flex justify-between">
              <p className="text-gray-700 font-medium">Name:</p>
              <p className="text-gray-900">
                {booking.user_profile.first_name} {booking.user_profile.last_name}
              </p>
            </div>

            {/* Phone */}
            {booking.user_profile.phone_number && (
              <div className="flex justify-between">
                <p className="text-gray-700 font-medium">Phone:</p>
                <p className="text-gray-900">{booking.user_profile.phone_number}</p>
              </div>
            )}

            {/* Place */}
            {booking.user_profile.place && (
              <div className="flex justify-between">
                <p className="text-gray-700 font-medium">Place:</p>
                <p className="text-gray-900">{booking.user_profile.place}</p>
              </div>
            )}

            {/* Profile Picture */}
            {booking.user_profile.profile_pic && (
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-medium">Profile Picture:</p>
                <img
                  src={booking.user_profile.profile_pic}
                  alt="User Profile"
                  className="h-12 w-12 rounded-full border object-cover"
                />
              </div>
            )}
          </>
        )}
        {!booking.profile_completed && (
          <div className="text-sm text-gray-500 italic">
            User profile not completed
          </div>
        )}
      </div>
    </div>
  );
};

export default AgencyBookingDetailsPage;
