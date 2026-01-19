import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUpdatePackage } from "../hooks/useUpdatePackage";
import { useGetOnePackage } from "../hooks/useGetOnePackage";
import { getCroppedImage } from "../../../utils/cropImage";
import ImageCropModal from "../../../components/ImageCropModal";
import toast from "react-hot-toast";

const EditPackagePage = () => {
  const { id } = useParams();
  const { pkg, loading: fetching, error: fetchError } = useGetOnePackage(id);
  const { handleUpdate, loading: updating, error: updateError } =
    useUpdatePackage();

  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [cropTarget, setCropTarget] = useState(null); // "main" | "sub"

  const [mainImagePreview, setMainImagePreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    main_image: null,
    images: [],
  });

  const [existingImages, setExistingImages] = useState([]);
  const navigate = useNavigate();

  /* ---------------- Load package ---------------- */
  useEffect(() => {
    if (pkg) {
      setForm({
        title: pkg.title || "",
        description: pkg.description || "",
        price: pkg.price || "",
        duration: pkg.duration || "",
        main_image: null,
        images: [],
      });
      setExistingImages(pkg.images || []);
    }
  }, [pkg]);

  /* ---------------- Cleanup preview ---------------- */
  useEffect(() => {
    return () => {
      if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
    };
  }, [mainImagePreview]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= MAIN IMAGE ================= */
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

  /* ================= SUB IMAGE ================= */
  const handleSubImageChange = (e) => {
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

  /* ================= APPLY CROP ================= */
  const handleCropConfirm = async (croppedAreaPixels) => {
    const croppedFile = await getCroppedImage(
      cropImageSrc,
      croppedAreaPixels
    );

    if (cropTarget === "main") {
      setForm((prev) => ({
        ...prev,
        main_image: croppedFile,
      }));

      const previewUrl = URL.createObjectURL(croppedFile);
      setMainImagePreview(previewUrl);
    }

    if (cropTarget === "sub") {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, croppedFile],
      }));
    }

    setIsCropping(false);
    setCropImageSrc(null);
    setCropTarget(null);
  };

  /* ================= REMOVE ================= */
  const handleRemoveExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  /* ================= SUBMIT ================= */
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

    existingImages.forEach((img) =>
      formData.append("existing_image_ids", img.id)
    );

    form.images.forEach((img) => formData.append("images", img));

    try {
      await handleUpdate(id, formData);
      toast.success("Package updated successfully!");
      navigate("/agency/my-packages");
    } catch (err) {
      toast.error("Problem occurred while editing the package.");
    }
  };

  if (fetching) return <p className="p-6 text-gray-600">Loading package...</p>;
  if (fetchError) return <p className="p-6 text-red-600">{fetchError}</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 font-jakarta">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Edit Package
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block font-medium text-gray-700 mb-1">
            Package Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        {/* Price & Duration */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block font-medium text-gray-700 mb-1">
              Price (₹)
            </label>
            <input
              id="price"
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
              min="1"
              required
            />
          </div>

          <div>
            <label htmlFor="duration" className="block font-medium text-gray-700 mb-1">
              Duration (Days)
            </label>
            <input
              id="duration"
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
              min="1"
              required
            />
          </div>
        </div>

        {/* Main Image */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Main Image
          </label>

          {!mainImagePreview && pkg?.main_image && (
            <img
              src={pkg.main_image}
              className="h-24 rounded mb-2 object-cover"
              alt="Current main"
            />
          )}

          {mainImagePreview && (
            <img
              src={mainImagePreview}
              className="h-24 rounded mb-2 object-cover border-2 border-green-500"
              alt="New main"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
          />
        </div>

        {/* Sub Images */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Gallery Images
          </label>

          <div className="flex flex-wrap gap-3 mb-2">
            {existingImages.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={img.image_url}
                  className="h-20 w-20 object-cover rounded"
                  alt="Existing"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(idx)}
                  className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1"
                >
                  ✕
                </button>
              </div>
            ))}

            {form.images.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  className="h-20 w-20 object-cover rounded"
                  alt="New"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(idx)}
                  className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleSubImageChange}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/agency/my-packages")}
            className="px-6 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updating}
            className="px-6 py-2 bg-green-600 text-white rounded-lg"
          >
            {updating ? "Updating..." : "Update Package"}
          </button>
        </div>

      </form>
      </div>

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

export default EditPackagePage;
