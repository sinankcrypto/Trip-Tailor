// src/features/packages/pages/CreatePackagePage.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreatePackage } from "../hooks/useCreatePackage";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const CreatePackagePage = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    main_image: null,
    images: [],
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [crop, setCrop] = useState({ unit: "%", x: 0, y: 0, width: 80, aspect: 16 / 9 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const { handleCreate, loading, error } = useCreatePackage();
  const navigate = useNavigate();

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
    const files = Array.from(e.target.files).slice(0, 4); // limit to 4
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
      navigate("agency/my-packages");
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
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-400"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-400"
          rows={4}
        />

        {/* Price & Duration */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-400"
          />
          <input
            type="number"
            name="duration"
            placeholder="Duration (days)"
            value={form.duration}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Main Image Upload */}
        <div>
          <label className="block font-medium mb-2">Main Image (with cropping)</label>
          <input
            type="file"
            name="main_image"
            accept="image/*"
            onChange={handleMainImageChange}
            required
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

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Package"}
        </button>

        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default CreatePackagePage;
