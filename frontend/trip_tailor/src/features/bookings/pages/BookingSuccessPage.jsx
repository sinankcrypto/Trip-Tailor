import { useParams, useNavigate } from "react-router-dom";
import { useGetBooking } from "../hooks/useGetBooking";

const BookingSuccessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { booking, loading, error } = useGetBooking(id);

  if (loading) return <p>Loading booking...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Booking Successful!
        </h1>

        <p className="text-gray-700 mb-2">
          <strong>Package:</strong> {booking.package_title}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Date:</strong> {booking.date}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Members:</strong> {booking.no_of_members}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Amount:</strong> ₹{booking.amount}
        </p>

        <button
          onClick={() => navigate("/User/Home")}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
