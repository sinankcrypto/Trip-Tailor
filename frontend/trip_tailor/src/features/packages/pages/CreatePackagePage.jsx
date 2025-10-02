// src/features/packages/pages/CreatePackagePage.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreatePackage } from "../hooks/useCreatePackage";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
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
  const [previewUrl, setPreviewUrl] = useState(null);
  const [crop, setCrop] = useState({ unit: "%", x: 0, y: 0, width: 80, aspect: 16 / 9 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const { handleCreate, loading } = useCreatePackage();
  const navigate = useNavigate();

  // ✅ Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) {
      newErrors.title = "Title is required.";
    } else if (/^\d+$/.test(form.title)) {
      newErrors.title = "Title cannot be only numbers.";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (/^\d+$/.test(form.description)) {
      newErrors.description = "Description cannot be only numbers.";
    }

    if (!form.price || form.price <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    if (!form.duration || form.duration <= 0) {
      newErrors.duration = "Duration must be greater than 0.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // For preview before cropping
  useEffect(() => {
    if (!form.main_image) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(form.main_image);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [form.main_image]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMainImageChange = (e) => {
    if (e.target.files[0]) {
      setForm({ ...form, main_image: e.target.files[0] });
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setForm({ ...form, images: files });
  };

  const getCroppedImage = () => {
    if (!completedCrop?.width || !completedCrop?.height || !imgRef.current) return;

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        setForm((prev) => ({
          ...prev,
          main_image: new File([blob], "cropped.jpg", { type: "image/jpeg" }),
        }));
      }
    }, "image/jpeg");
  };

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
      navigate("/agency/my-packages"); // ✅ fixed
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create package ❌");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-jakarta">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Create New Package</h1>

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
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
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
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
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
          <label className="block font-medium mb-2">Main Image (with cropping)</label>
          <input
            type="file"
            name="main_image"
            accept="image/*"
            onChange={handleMainImageChange}
            className="mb-4"
          />

          {previewUrl && (
            <div>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={16 / 9}
              >
                <img ref={imgRef} src={previewUrl} alt="Preview" className="max-h-96" />
              </ReactCrop>
              <button
                type="button"
                onClick={getCroppedImage}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Apply Crop
              </button>
            </div>
          )}
        </div>

        {/* Sub Images */}
        <div>
          <label className="block font-medium mb-2">Sub Images (up to 4)</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
          />

          <div className="grid grid-cols-4 gap-2 mt-2">
            {form.images.map((img, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(img)}
                alt={`sub-${idx}`}
                className="h-24 w-full object-cover rounded-md border"
              />
            ))}
          </div>
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
    </div>
  );
};

export default CreatePackagePage;
