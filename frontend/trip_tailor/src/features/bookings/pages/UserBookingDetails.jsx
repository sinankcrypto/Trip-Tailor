import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useGetBooking } from "../hooks/useGetBooking";

const UserBookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { booking, loading, error } = useGetBooking(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-green-600" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <p>{error || "Booking not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 font-jakarta">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Booking Details
      </h1>

      <div className="bg-white shadow-lg rounded-xl p-6 grid md:grid-cols-2 gap-8 items-center">
        {/* Left: Image */}
        <div>
          <img
            src={booking.package_image}
            alt={booking.package_title}
            className="w-full h-64 object-cover rounded-xl shadow"
          />
        </div>

        {/* Right: Booking Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {booking.package_title}
          </h2>

          <p className="text-gray-600">
            <span className="font-medium text-gray-800">Agency:</span>{" "}
            {booking.agency_name}
          </p>

          <p className="text-gray-600">
            <span className="font-medium text-gray-800">Booked By:</span>{" "}
            {booking.username}
          </p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-gray-500 text-sm">No. of Members</p>
              <p className="text-gray-800 font-semibold">
                {booking.no_of_members}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Duration</p>
              <p className="text-gray-800 font-semibold">
                {booking.package_duration}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Total Price</p>
              <p className="text-gray-800 font-semibold">
                ₹{booking.amount?.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Payment Status</p>
              <p
                className={`font-semibold ${
                  booking.payment_status?.toLowerCase() === "paid"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {booking.payment_status}
              </p>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <p className="text-gray-500 text-sm">Travel Date</p>
            <p className="text-gray-800 font-semibold">
              {new Date(booking.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-gray-800 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default UserBookingDetailsPage;
