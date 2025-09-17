import { useGetMyPackages } from "../hooks/useGetMyPackages";
import { useDeletePackage } from "../hooks/useDeletePackage";
import { useUpdatePackage } from "../hooks/useUpdatePackage";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { ListFilter, Plus } from "lucide-react";
import { useToggleList } from "../hooks/useToggleList";

const MyPackagesPage = () => {
  const { packages, loading, error } = useGetMyPackages();
  const { handleDelete, loading: deleting } = useDeletePackage();
  const { handleUpdate, loading: updating } = useUpdatePackage();
  const { handleToggle, loading: updading } = useToggleList();

  const [sortOrder, setSortOrder] = useState("desc");
  const navigate = useNavigate();

  const sortedPackages = useMemo(() => {
    return [...packages].sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at)
    );
  }, [packages, sortOrder]);

  if (loading) return <p className="p-6 text-gray-600">Loading packages...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      await handleDelete(id);
      window.location.reload(); // Replace with state update ideally
    }
  };

  const handleToggleList = async (pkg) => {
    try {
      await handleToggle(pkg.id);
      window.location.reload(); // or update state directly
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (id) => {
    navigate(`/agency/packages/${id}/edit`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 font-jakarta">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Packages</h1>
        <Link
          to="/agency/packages/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          <Plus className="w-5 h-5" />
          Create New Package
        </Link>
      </div>

      {/* Sort */}
      <div className="flex justify-end items-center mb-6">
        <label className="flex items-center gap-2 text-gray-600">
          <ListFilter className="w-4 h-4" />
          <span>Sort by:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </label>
      </div>

      {/* Package List */}
      <table className="w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Image</th>
            <th className="p-3">Title</th>
            <th className="p-3">Status</th>
            <th className="p-3">Created</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedPackages.map((pkg) => (
            <tr key={pkg.id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                <img
                  src={pkg.main_image}
                  alt={pkg.title}
                  className="h-16 w-24 object-cover rounded"
                />
              </td>
              <td className="p-3 font-medium">{pkg.title}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    pkg.is_listed
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {pkg.is_listed ? "Listed" : "Unlisted"}
                </span>
              </td>
              <td className="p-3 text-sm text-gray-500">
                {new Date(pkg.created_at).toLocaleDateString()}
              </td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => handleEditClick(pkg.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleList(pkg)}
                  disabled={updating}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                  {pkg.is_listed ? "Unlist" : "List"}
                </button>
                <button
                  onClick={() => handleDeleteClick(pkg.id)}
                  disabled={deleting}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyPackagesPage;
