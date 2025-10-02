import { useParams, useNavigate } from "react-router-dom";
import { useGetOnePackage } from "../hooks/useGetOnePackage";

const PackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // 👈 add this
  const { pkg, loading, error } = useGetOnePackage(id);

  const packagedata = pkg

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
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Section - Main & Sub Images */}
          <div className="p-6 flex flex-col items-center">
            {packagedata.main_image && (
              <img
                src={packagedata.main_image}
                alt={packagedata.title}
                className="w-full h-80 object-cover rounded-xl shadow-md mb-6"
              />
            )}

            {packagedata.images && packagedata.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                {packagedata.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.image_url}
                    alt={`Sub image ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Section - Details */}
          <div className="p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {packagedata.title}
            </h1>

            <p className="text-gray-700 leading-relaxed mb-6">
              {packagedata.description}
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-gray-500 text-sm">Price</p>
                <p className="text-lg font-semibold text-gray-800">
                  ₹{packagedata.price}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Duration</p>
                <p className="text-lg font-semibold text-gray-800">
                  {packagedata.duration} days
                </p>
              </div>
            </div>

            {/* Book Now Button with navigation */}
            <button
              onClick={() => navigate(`/book/${id}`)} // 👈 redirects to booking page
              className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 transition"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailPage;
