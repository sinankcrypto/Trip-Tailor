// src/features/packages/pages/PackagesPage.jsx
import { Link } from "react-router-dom";
import { useGetPackages } from "../hooks/useGetPackages";

const PackagesPage = () => {
  const { packages, loading, error } = useGetPackages();

  if (loading) return <p className="p-6 text-gray-600">Loading packages...</p>;
  if (error) return <p className="p-6 text-red-600">{JSON.stringify(error)}</p>;

  if (!packages.length) {
    return <p className="p-6 text-gray-600">No packages available.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 font-jakarta">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Explore Packages</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
          >
            {pkg.main_image ? (
              <img
                src={pkg.main_image}
                alt={pkg.title}
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="h-48 w-full bg-gray-100 flex items-center justify-center text-gray-400">
                No image
              </div>
            )}

            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {pkg.title}
              </h2>
              <p className="text-gray-600 text-sm line-clamp-2 flex-grow">
                {pkg.description}
              </p>
              <div className="mt-3">
                <span className="text-green-600 font-bold text-lg">
                  ₹{pkg.price}
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  {pkg.duration} days
                </span>
              </div>

              <Link
                to={`/packages/${pkg.id}`}
                className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white text-center px-4 py-2 rounded-lg transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackagesPage;
