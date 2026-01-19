import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import { useGetOnePackage } from "../hooks/useGetOnePackage";
import { useGetPackageReviews } from "../../bookings/hooks/useGetPackageReviews";

const AgencyPackageDetailsPage = () => {
  const { id } = useParams();

  const { pkg, loading, error } = useGetOnePackage(id);
  const {
    reviews,
    loading: reviewsLoading,
    loadMore,
    hasMore,
  } = useGetPackageReviews(id);

  if (loading) {
    return <p className="text-center mt-10">Loading package...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-[Plus Jakarta Sans]">

      {/* 📦 Package Header */}
      <div className="bg-white rounded-xl shadow p-6 grid md:grid-cols-2 gap-8">
        <img
          src={pkg.main_image}
          alt={pkg.title}
          className="w-full h-80 object-cover rounded-lg"
        />

        <div>
          <h1 className="text-3xl font-bold mb-3">{pkg.title}</h1>

          {/* ⭐ Rating */}
          <div className="flex items-center gap-2 mb-4">
            <span className="font-semibold text-yellow-500">
              {pkg.average_rating?.toFixed(1)}
            </span>
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
            <span className="text-sm text-gray-500">
              ({pkg.total_reviews} reviews)
            </span>
          </div>

          <p className="text-gray-700 mb-4">{pkg.description}</p>

          <div className="space-y-2">
            <p>
              <span className="text-gray-500">Price:</span>{" "}
              <span className="font-semibold">₹{pkg.price}</span>
            </p>
            <p>
              <span className="text-gray-500">Duration:</span>{" "}
              <span className="font-semibold">{pkg.duration} days</span>
            </p>
          </div>
        </div>
      </div>

      {/* 🖼️ Extra Images */}
      {pkg.images?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {pkg.images.map((img) => (
            <img
              key={img.id}
              src={img.image_url}
              alt="Package"
              className="h-40 w-full object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {/* ⭐ Reviews Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">
          Reviews ({pkg.total_reviews})
        </h2>

        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white shadow rounded-lg p-4 mb-4"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                {review.user_username || "User"}
              </p>
              <span className="text-yellow-500 font-medium">
                ⭐ {review.rating}
              </span>
            </div>

            <p className="text-gray-700 mt-2">{review.comment}</p>
          </div>
        ))}

        {reviewsLoading && (
          <p className="text-center text-gray-500">Loading reviews...</p>
        )}

        {hasMore && (
          <div className="flex justify-center mt-4">
            <button
              onClick={loadMore}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Load more reviews
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgencyPackageDetailsPage;
