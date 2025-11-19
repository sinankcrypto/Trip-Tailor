import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGetOnePackage } from "../hooks/useGetOnePackage";
import { Star, X } from "lucide-react";

const PackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pkg, loading, error } = useGetOnePackage(id);

  const packagedata = pkg;
  const [zoomedImage, setZoomedImage] = useState(null);

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
          {/* Left Section - Images */}
          <div className="p-6 flex flex-col items-center">
            {packagedata.main_image && (
              <div
                className="relative group cursor-zoom-in"
                onClick={() => setZoomedImage(packagedata.main_image)}
              >
                <img
                  src={packagedata.main_image}
                  alt={packagedata.title}
                  className="w-full h-80 object-cover rounded-xl shadow-md transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>
            )}

            {packagedata.images && packagedata.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full mt-4">
                {packagedata.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group cursor-zoom-in"
                    onClick={() => setZoomedImage(img.image_url)}
                  >
                    <img
                      src={img.image_url}
                      alt={`Sub image ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg shadow transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Section - Package Details */}
          <div className="p-8 flex flex-col justify-center">
            <h1
              className="text-3xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {packagedata.title}
            </h1>

            {/* ⭐ Package Rating */}
            <div className="flex items-center gap-2 mb-4">
              <p className="text-lg font-semibold text-yellow-500">4.6</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${
                      i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-500 text-sm ml-1">(120 reviews)</p>
            </div>

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

            {/* Book Now Button */}
            <button
              onClick={() => navigate(`/book/${id}`)}
              className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition self-start"
            >
              Book Now
            </button>
          </div>
        </div>

        {/* 📦 Agency Info Section */}
        {packagedata.agency && (
          <div className="border-t px-8 py-6 flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={packagedata.agency.profile_pic}
              alt={packagedata.agency.agency_name}
              className="w-24 h-24 rounded-full object-cover shadow-md"
            />

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {packagedata.agency.agency_name}
              </h2>
              <p className="text-gray-700 mb-2">
                {packagedata.agency.description}
              </p>
              <p className="text-gray-600 text-sm">
                📍 {packagedata.agency.address}
              </p>
              <p className="text-gray-600 text-sm">
                ☎️ {packagedata.agency.phone_number}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 🔍 Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={() => setZoomedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white text-2xl"
            onClick={() => setZoomedImage(null)}
          >
            <X size={28} />
          </button>
          <img
            src={zoomedImage}
            alt="Zoomed"
            className="max-w-[90%] max-h-[85%] rounded-xl shadow-lg object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default PackageDetailPage;
