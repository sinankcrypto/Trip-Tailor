import { useState, useMemo } from "react";
import { useGetAllPackages } from "../hooks/useGetAllPackages";
import { useToggleList } from "../hooks/useToggleList";
import ConfirmModal from "../../../components/ConfirmModal";
import toast from "react-hot-toast";

const AdminPackagesPage = () => {
  const [page, setPage] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filters = useMemo(() => ({ page, page_size: 10 }), [page]);

  const {
    packages,
    pagination,
    loading: packagesLoading,
    error: packagesError,
    refetch,
  } = useGetAllPackages(filters);

  const {
    handleToggle,
    loading: toggleLoading,
    error: toggleError,
  } = useToggleList();

  const openConfirmModal = (pkg) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const confirmToggle = async () => {
    if (!selectedPackage) return;
    try {
      await handleToggle(selectedPackage.id);
      setIsModalOpen(false);
      await refetch(); // Refresh package list after toggling
      toast.success(
        selectedPackage.is_listed ? "Package unlisted successfully" : "Package listed successfully"
      );
    } catch (err) {
      console.error("Toggle failed:", err);
      toast.error("Failed to toggle package. Please try again.");
    }
  };

  if (packagesLoading)
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  if (packagesError)
    return <div className="text-center mt-10 text-red-500">{packagesError}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">All Packages</h1>

      {/* Packages Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Agency</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Duration</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {packages.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No packages found
                </td>
              </tr>
            ) : (
              packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-gray-600">{pkg.id}</td>
                  <td className="border px-4 py-2 font-medium text-gray-800">
                    {pkg.title}
                  </td>
                  <td className="border px-4 py-2 text-gray-700">
                    {pkg.agency_name}
                  </td>
                  <td className="border px-4 py-2 text-gray-700">
                    ₹{pkg.price}
                  </td>
                  <td className="border px-4 py-2 text-gray-700">
                    {pkg.duration} days
                  </td>
                  <td className="border px-4 py-2">
                    {pkg.is_deleted ? (
                      <span className="text-red-500 font-semibold">Deleted</span>
                    ) : pkg.is_listed ? (
                      <span className="text-green-600 font-semibold">
                        Listed
                      </span>
                    ) : (
                      <span className="text-gray-500 font-semibold">
                        Unlisted
                      </span>
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {!pkg.is_deleted ? (
                      <button
                        onClick={() => openConfirmModal(pkg)}
                        disabled={toggleLoading}
                        className={`px-4 py-1 rounded-md text-sm font-medium text-white transition ${
                          pkg.is_listed
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        } ${toggleLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                      >
                        {toggleLoading
                          ? "Processing..."
                          : pkg.is_listed
                          ? "Unlist"
                          : "List"}
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm italic">No actions</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 gap-3">
        <button
          disabled={!pagination?.previous}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            pagination?.previous
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Prev
        </button>
        <span className="px-3 py-2 text-gray-700">
          Page {pagination?.page || 1} of {pagination?.totalPages || 1}
        </span>
        <button
          disabled={!pagination?.next}
          onClick={() => setPage((prev) => prev + 1)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            pagination?.next
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>

      {/* Confirm Modal */}
      {isModalOpen && selectedPackage && (
        <ConfirmModal
        isOpen={isModalOpen}
          title={`${selectedPackage.is_listed ? "Unlist" : "List"} Package`}
          message={`Are you sure you want to ${
            selectedPackage.is_listed ? "unlist" : "list"
          } this package: "${selectedPackage.title}"?`}
          onConfirm={confirmToggle}
          onCancel={() => setIsModalOpen(false)}
        />
      )}

      {/* Optional Error Display */}
      {toggleError && (
        <p className="text-center text-red-600 mt-4">{toggleError}</p>
      )}
    </div>
  );
};

export default AdminPackagesPage;
