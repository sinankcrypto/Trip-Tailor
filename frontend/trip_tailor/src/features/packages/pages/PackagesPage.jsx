import { Link } from "react-router-dom";
import { useGetPackages } from "../hooks/useGetPackages";
import { useState } from "react";

const PackagesPage = () => {
  const [filters, setFilters] = useState({
    search: "",
    price__gte: "",
    price__lte: "",
    ordering: "-created_at",
    page: 1,
  });

  const [searchInput, setSearchInput] = useState(filters.search);
  const [priceInput, setPriceInput] = useState({
    price__gte: filters.price__gte,
    price__lte: filters.price__lte,
  });

  const { packages, pagination, loading, error } = useGetPackages(filters);

  // --- Handlers ---
  const handleSearchChange = (e) => setSearchInput(e.target.value);
  const handleSearchSubmit = () =>
    setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceInput((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceApply = () =>
    setFilters((prev) => ({
      ...prev,
      ...priceInput,
      page: 1,
    }));

  const handleSortChange = (e) =>
    setFilters((prev) => ({ ...prev, ordering: e.target.value }));

  const handlePageChange = (url) => {
    if (!url) return;
    const page = new URL(url).searchParams.get("page");
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      price__gte: "",
      price__lte: "",
      ordering: "-created_at",
      page: 1,
    });
    setSearchInput("");
    setPriceInput({ price__gte: "", price__lte: "" });
  };

  if (loading) return <p className="p-6 text-gray-600">Loading packages...</p>;
  if (error) return <p className="p-6 text-red-600">{JSON.stringify(error)}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-8 font-jakarta" >
        {/* Filters Section */}
        <div className="flex flex-col md:flex-row flex-wrap gap-3 mb-8 items-center justify-between bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-200" >
          {/* Search */}
          <div className="flex w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search packages..."
              value={searchInput}
              onChange={handleSearchChange}
              className="border px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-green-500"
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            />
            <button
              onClick={handleSearchSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700"
            >
              Go
            </button>
          </div>

          {/* Price Filters */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="price__gte"
              placeholder="Min price"
              value={priceInput.price__gte}
              onChange={handlePriceChange}
              className="border px-3 py-2 rounded-md w-28 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <input
              type="number"
              name="price__lte"
              placeholder="Max price"
              value={priceInput.price__lte}
              onChange={handlePriceChange}
              className="border px-3 py-2 rounded-md w-28 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <button
              onClick={handlePriceApply}
              className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
            >
              Apply
            </button>
          </div>

          {/* Sort */}
          <select
            value={filters.ordering}
            onChange={handleSortChange}
            className="border px-4 py-2 rounded-md w-full md:w-1/4 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="-created_at">Newest First</option>
            <option value="created_at">Oldest First</option>
            <option value="-price">Highest Price</option>
            <option value="price">Lowest Price</option>
          </select>

          {/* Reset Button */}
          <button
            onClick={handleResetFilters}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Reset
          </button>
        </div>

        {/* Centered Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Discover your love
        </h1>


        {/* Divider Text */}
        {/* <p className="text-center text-gray-500 mb-6 text-lg italic">
          Choose the trip that speaks to your soul
        </p> */}

        {/* Packages Grid */}
        {packages.length === 0 ? (
          <p className="text-gray-600 text-center">No packages available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden flex flex-col"
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

                <div className="p-5 flex flex-col flex-grow">
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
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-8">
          <button
            disabled={!pagination.previous}
            onClick={() => handlePageChange(pagination.previous)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={!pagination.next}
            onClick={() => handlePageChange(pagination.next)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>    
  );
};

export default PackagesPage;
