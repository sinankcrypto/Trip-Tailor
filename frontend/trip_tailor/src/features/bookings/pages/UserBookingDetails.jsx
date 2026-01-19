import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Star } from "lucide-react";
import { useState } from "react";
import { useGetBooking } from "../hooks/useGetBooking";
import useAddReview from "../hooks/useAddReview";

const UserBookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { booking, loading, error } = useGetBooking(id);

  // Review state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    addReview: createReview,
    loading: reviewLoading,
    error: reviewError,
  } = useAddReview();

  const handleSubmitReview = async () => {
    if (!rating) return;

    await createReview({
      booking: booking.id,
      rating,
      comment,
    });

    // reset after success
    setRating(0);
    setComment("");
  };

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

      {/* Booking Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 grid md:grid-cols-2 gap-8 items-center">
        {/* Image */}
        <div>
          <img
            src={booking.package_image}
            alt={booking.package_title}
            className="w-full h-64 object-cover rounded-xl shadow"
          />
        </div>

        {/* Details */}
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
              <p className="text-gray-500 text-sm">Members</p>
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
              <p className="text-gray-500 text-sm">Payment</p>
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

      {/* Review Section (ONLY if completed) */}
      {booking.booking_status === "COMPLETED" && (
        <div className="mt-10 max-w-3xl mx-auto">
          {booking.review ? (
            /* Existing Review */
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Your Review
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= booking.review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-4">
                {booking.review.comment}
              </p>

              <p className="text-sm text-gray-400 mt-3">
                Reviewed on{" "}
                {new Date(booking.review.created_at).toLocaleDateString()}
              </p>
            </div>
          ) : (
            /* Add Review */
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Leave a Review
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Comment */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-600"
              />

              {reviewError && (
                <p className="text-red-500 text-sm mt-2">{reviewError}</p>
              )}

              <button
                onClick={handleSubmitReview}
                disabled={reviewLoading || !rating}
                className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-medium"
              >
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          )}
        </div>
      )}


      {/* Back */}
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
