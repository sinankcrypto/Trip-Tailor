import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUpdatePackage } from "../hooks/useUpdatePackage";
import { useGetOnePackage } from "../hooks/useGetOnePackage";
import toast from "react-hot-toast";

const EditPackagePage = () => {
  const { id } = useParams();
  const { pkg, loading: fetching, error: fetchError } = useGetOnePackage(id);
  const { handleUpdate, loading: updating, error: updateError } =
    useUpdatePackage();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    main_image: null,
    images: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (pkg) {
      setForm((prev) => ({
        ...prev,
        title: pkg.title || "",
        description: pkg.description || "",
        price: pkg.price || "",
        duration: pkg.duration || "",
      }));
    }
  }, [pkg]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMainImageChange = (e) => {
    setForm({ ...form, main_image: e.target.files[0] });
  };

  const handleImagesChange = (e) => {
    setForm({ ...form, images: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("duration", form.duration);
    if (form.main_image) {
      formData.append("main_image", form.main_image);
    }
    form.images.forEach((img) => formData.append("images", img));

    try {
      await handleUpdate(id, formData);
      toast.success("Edited package")
      navigate("/agency/my-packages");
    } catch (err) {
      console.error(err);
      toast.error("Problem occured while editing package")
    }
  };

  if (fetching) return <p className="p-6 text-gray-600">Loading package...</p>;
  if (fetchError) return <p className="p-6 text-red-600">{fetchError}</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 font-jakarta">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Package</h1>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (days)
              </label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Image
            </label>

            {pkg?.main_image && (
              <img
                src={pkg.main_image}
                alt="Current main"
                className="h-24 rounded mb-2 object-cover"
              />
            )}

            <input
              type="file"
              name="main_image"
              accept="image/*"
              onChange={handleMainImageChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
            />
          </div>

          {/* Sub Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub Images (optional, up to 4)
            </label>

            {pkg?.images?.length > 0 && (
              <div className="flex gap-2 mb-2">
                {pkg.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Sub ${idx}`}
                    className="h-20 w-20 object-cover rounded"
                  />
                ))}
              </div>
            )}

            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/agency/my-packages")}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 disabled:opacity-50 transition"
            >
              {updating ? "Updating..." : "Update Package"}
            </button>
          </div>
        </form>

        {updateError && (
          <p className="mt-4 text-red-600 text-sm">{updateError}</p>
        )}
      </div>
    </div>
  );
};

export default EditPackagePage;
