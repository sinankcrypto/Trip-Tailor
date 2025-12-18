// src/features/packages/pages/CreatePackagePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreatePackage } from "../hooks/useCreatePackage";
import ImageCropModal from "../../../components/ImageCropModal";
import { getCroppedImage } from "../../../utils/cropImage";
import toast from "react-hot-toast";

const CreatePackagePage = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    main_image: null,
    images: [],
  });

  const [errors, setErrors] = useState({});

  // 🔹 cropping state
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [cropTarget, setCropTarget] = useState(null); // "main" | "sub"
  const [isCropping, setIsCropping] = useState(false);

  const { handleCreate, loading } = useCreatePackage();
  const navigate = useNavigate();

  /* ---------------- validation ---------------- */
  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Title is required.";
    else if (/^\d+$/.test(form.title))
      newErrors.title = "Title cannot be only numbers.";

    if (!form.description.trim())
      newErrors.description = "Description is required.";
    else if (/^\d+$/.test(form.description))
      newErrors.description = "Description cannot be only numbers.";

    if (!form.price || form.price <= 0)
      newErrors.price = "Price must be greater than 0.";

    if (!form.duration || form.duration <= 0)
      newErrors.duration = "Duration must be greater than 0.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- handlers ---------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🟢 MAIN IMAGE
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result);
      setCropTarget("main");
      setIsCropping(true);
    };
    reader.readAsDataURL(file);
  };

  // 🟢 SUB IMAGES
  const handleImagesChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result);
      setCropTarget("sub");
      setIsCropping(true);
    };
    reader.readAsDataURL(file);
  };

  // 🟢 APPLY CROP
  const handleCropConfirm = async (croppedAreaPixels) => {
    const croppedFile = await getCroppedImage(
      cropImageSrc,
      croppedAreaPixels
    );

    if (cropTarget === "main") {
      setForm((prev) => ({ ...prev, main_image: croppedFile }));
    } else {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, croppedFile].slice(0, 4),
      }));
    }

    setIsCropping(false);
    setCropImageSrc(null);
    setCropTarget(null);
  };

  const handleRemoveNewImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  /* ---------------- submit ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting ❌");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("duration", form.duration);

    if (form.main_image) formData.append("main_image", form.main_image);
    form.images.forEach((img) => formData.append("images", img));

    try {
      await handleCreate(formData);
      toast.success("Package created successfully! 🎉");
      navigate("/agency/my-packages");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create package ❌");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-4xl mx-auto p-6 font-jakarta">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Create New Package
      </h1>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-6 bg-white p-6 rounded-xl shadow-md border border-green-100"
      >
        {/* Title */}
        <div>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-400"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-400"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Price & Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-400"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>
          <div>
            <input
              type="number"
              name="duration"
              placeholder="Duration (days)"
              value={form.duration}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-400"
            />
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
            )}
          </div>
        </div>

        {/* Main Image */}
        <div>
          <label className="block font-medium mb-2">
            Main Image (with cropping)
          </label>

          {form.main_image && (
            <img
              src={URL.createObjectURL(form.main_image)}
              alt="main preview"
              className="h-32 rounded mb-2 object-cover"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
          />
        </div>

        {/* Sub Images */}
        <div>
          <label className="block font-medium mb-2">
            Sub Images (up to 4)
          </label>

          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="h-20 w-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(idx)}
                    className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-bl"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImagesChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Package"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/agency/my-packages")}
            className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* 🔥 Crop Modal */}
      {isCropping && (
        <ImageCropModal
          imageSrc={cropImageSrc}
          onCancel={() => setIsCropping(false)}
          onConfirm={handleCropConfirm}
        />
      )}
    </div>
  );
};

export default CreatePackagePage;
