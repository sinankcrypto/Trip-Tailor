import React, { useState } from "react";

const ProfileForm = ({ initialValues, onSubmit, submitting }) => {
  const [values, setValues] = useState({
    first_name: initialValues?.first_name || "",
    last_name: initialValues?.last_name || "",
    place: initialValues?.place || "",
    phone_number: initialValues?.phone_number || "",
    profile_pic: null,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!values.first_name.trim()) newErrors.first_name = "First name is required.";
    if (!values.last_name.trim()) newErrors.last_name = "Last name is required.";
    if (values.phone_number && !/^[0-9]{10}$/.test(values.phone_number)) {
      newErrors.phone_number = "Phone number must be 10 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl p-6 rounded-xl shadow bg-white font-['Plus Jakarta Sans']"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Profile</h2>
      <div className="grid gap-5">
        {/* First Name */}
        <label className="grid gap-1">
          <span className="text-gray-700 font-medium">First name</span>
          <input
            name="first_name"
            value={values.first_name}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none ${
              errors.first_name ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
        </label>

        {/* Last Name */}
        <label className="grid gap-1">
          <span className="text-gray-700 font-medium">Last name</span>
          <input
            name="last_name"
            value={values.last_name}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none ${
              errors.last_name ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
        </label>

        {/* Place */}
        <label className="grid gap-1">
          <span className="text-gray-700 font-medium">Place</span>
          <input
            name="place"
            value={values.place}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none border-gray-300"
          />
        </label>

        {/* Phone Number */}
        <label className="grid gap-1">
          <span className="text-gray-700 font-medium">Phone number</span>
          <input
            name="phone_number"
            value={values.phone_number}
            onChange={handleChange}
            placeholder="Enter 10-digit number"
            className={`border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none ${
              errors.phone_number ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phone_number && (
            <p className="text-red-500 text-sm">{errors.phone_number}</p>
          )}
        </label>

        {/* Profile Picture */}
        <label className="grid gap-1">
          <span className="text-gray-700 font-medium">Profile picture</span>
          <input
            type="file"
            name="profile_pic"
            accept="image/*"
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                profile_pic: e.target.files[0], // store File object
              }))
            }
            className="border rounded-lg px-3 py-2 border-gray-300 focus:ring-2 focus:ring-green-400"
          />
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export default ProfileForm;
