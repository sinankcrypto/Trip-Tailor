// src/features/bookings/pages/BookingPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGetOnePackage } from "../../packages/hooks/useGetOnePackage";
import { createBooking } from "../services/BookingService";
import getTomorrowDate from "../../../utils/getTomorrowDate";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { packagedata, loading, error } = useGetOnePackage(id);

  const [form, setForm] = useState({
    no_of_members: 1,
    date: "",
    payment_method: "ON_HAND",
  });

  const [errors, setErrors] = useState({});

  // Calculate total price dynamically
  const totalPrice =
    packagedata && form.no_of_members
      ? Number(packagedata.price) * form.no_of_members
      : 0;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let newErrors = {};

    // ✅ Validate members count
    if (form.no_of_members < 1 || form.no_of_members > 15) {
      newErrors.no_of_members =
        "Number of members should be between 1 and 15.";
    }

    // ✅ Validate date (must be future)
    if (form.date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // reset time
      const selectedDate = new Date(form.date);

      if (selectedDate <= today) {
        newErrors.date = "Please select a future date.";
      }
    } else {
      newErrors.date = "Please select a travel date.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        package: id,
        no_of_members: form.no_of_members,
        date: form.date,
        payment_method: form.payment_method,
      };
      const booking = await createBooking(payload);
      navigate(`/booking-success/${booking.id}`); // 👈 redirect to success page
    } catch (err) {
      console.error("Booking failed", err);
      alert("Failed to book package. Try again.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-600">Loading package...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8">
        {/* Package Info */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <img
            src={packagedata.main_image}
            alt={packagedata.title}
            className="w-full md:w-1/2 h-64 object-cover rounded-xl shadow-md"
          />
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {packagedata.title}
            </h1>
            <p className="text-gray-700">{packagedata.description}</p>
            <p className="text-lg font-semibold text-green-600 mt-4">
              ₹{packagedata.price} / person
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Number of Members */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Number of Members
            </label>
            <input
              type="number"
              name="no_of_members"
              min="1"
              max="15"
              value={form.no_of_members}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-green-300"
              required
            />
            {errors.no_of_members && (
              <p className="text-red-500 text-sm mt-1">
                {errors.no_of_members}
              </p>
            )}
          </div>

          {/* Date of Travel */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Date of Travel
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              min={getTomorrowDate()} // prevent past dates
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-green-300"
              required
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Payment Method
            </label>
            <select
              name="payment_method"
              value={form.payment_method}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-green-300"
            >
              <option value="ON_HAND">On Hand (Cash)</option>
              {/* Future: <option value="ONLINE">Online</option> */}
            </select>
          </div>

          {/* Total Price */}
          <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
            <span className="text-gray-700 font-medium">Total</span>
            <span className="text-xl font-bold text-green-600">
              ₹{totalPrice}
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 transition"
          >
            Book Package
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
