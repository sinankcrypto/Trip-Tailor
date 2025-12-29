import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGetOnePackage } from "../hooks/useGetOnePackage";
import { Star, X } from "lucide-react";
import { useCreateChatSession } from "../../chat/hooks/useCreateChatSession";
import { useGetPackageReviews } from "../../bookings/hooks/useGetPackageReviews";

const PackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { pkg, loading, error } = useGetOnePackage(id);
  const { createSession } = useCreateChatSession();

  const [zoomedImage, setZoomedImage] = useState(null);       // MAIN IMAGE
  const [zoomedSubIndex, setZoomedSubIndex] = useState(null); // SUB IMAGES

  const {
    reviews,
    loading: reviewsLoading,
    error: reviewsError,
    loadMore,
    hasMore,
  } = useGetPackageReviews(id);

  /* ================= HOTKEYS (SUB IMAGES ONLY) ================= */
  useEffect(() => {
    if (zoomedSubIndex === null || !pkg?.images?.length) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setZoomedSubIndex(null);
      }

      if (e.key === "ArrowRight") {
        setZoomedSubIndex((prev) =>
          prev < pkg.images.length - 1 ? prev + 1 : prev
        );
      }

      if (e.key === "ArrowLeft") {
        setZoomedSubIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomedSubIndex, pkg?.images]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-600 text-lg">Loading package...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-[Plus Jakarta Sans]">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* ================= LEFT: IMAGES ================= */}
          <div className="p-6 flex flex-col items-center">
            {/* Main Image */}
            {pkg.main_image && (
              <div
                className="cursor-zoom-in"
                onClick={() => setZoomedImage(pkg.main_image)}
              >
                <img
                  src={pkg.main_image}
                  alt={pkg.title}
                  className="w-full h-80 object-cover rounded-xl shadow-md"
                />
              </div>
            )}

            {/* Sub Images */}
            {pkg.images?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full mt-4">
                {pkg.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="cursor-zoom-in"
                    onClick={() => setZoomedSubIndex(idx)}
                  >
                    <img
                      src={img.image_url}
                      alt={`Sub image ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg shadow"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ================= RIGHT: DETAILS ================= */}
          <div className="p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {pkg.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <p className="text-lg font-semibold text-yellow-500">
                {pkg.average_rating.toFixed(1)}
              </p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={
                      star <= Math.round(pkg.average_rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <p className="text-gray-500 text-sm">
                ({pkg.total_reviews} reviews)
              </p>
            </div>

            <p className="text-gray-700 mb-6">{pkg.description}</p>

            <div className="mb-6 space-y-2">
              <p>
                <span className="text-gray-500">Price:</span>{" "}
                <span className="font-semibold">₹{pkg.price}</span>
              </p>
              <p>
                <span className="text-gray-500">Duration:</span>{" "}
                <span className="font-semibold">{pkg.duration} days</span>
              </p>
            </div>

            <button
              onClick={() => navigate(`/book/${id}`)}
              className="px-5 py-2 bg-green-600 text-white rounded-lg"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* ================= REVIEWS ================= */}
      <div className="mt-10 bg-white shadow-lg rounded-2xl px-8 py-6">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        {reviewsLoading && <p>Loading reviews...</p>}
        {reviewsError && <p className="text-red-500">{reviewsError}</p>}
        {!reviewsLoading && reviews.length === 0 && (
          <p>No reviews yet.</p>
        )}

        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex justify-between">
                <p className="font-semibold">{review.username || "User"}</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={
                        s <= review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
              <p className="text-sm text-gray-400">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              className="px-6 py-2 bg-gray-100 rounded-lg"
            >
              Show More Reviews
            </button>
          </div>
        )}
      </div>

      {/* ================= MAIN IMAGE MODAL ================= */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={() => setZoomedImage(null)}
        >
          <X
            className="absolute top-6 right-6 text-white"
            size={28}
            onClick={() => setZoomedImage(null)}
          />
          <img
            src={zoomedImage}
            alt="Zoomed"
            className="max-w-[90%] max-h-[85%] object-contain"
          />
        </div>
      )}

      {/* ================= SUB IMAGE MODAL (HOTKEYS) ================= */}
      {zoomedSubIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={() => setZoomedSubIndex(null)}
        >
          <X
            className="absolute top-6 right-6 text-white"
            size={28}
            onClick={() => setZoomedSubIndex(null)}
          />
          <img
            src={pkg.images[zoomedSubIndex].image_url}
            alt="Zoomed sub"
            className="max-w-[90%] max-h-[85%] object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default PackageDetailPage;
