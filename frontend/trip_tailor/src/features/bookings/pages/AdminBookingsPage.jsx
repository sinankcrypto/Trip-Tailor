// src/features/bookings/pages/AdminBookingsPage.jsx
import React, { useState } from "react";
import { useGetAllBookings } from "../hooks/useGetAllBookings";

const AdminBookingsPage = () => {
  const [filters, setFilters] = useState({});
  const { bookings, loading, error, refetch } = useGetAllBookings(filters);

  if (loading) return <div className="text-center mt-10">Loading bookings...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">All Bookings</h1>
      
      {/* Bookings Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Package</th>
              <th className="border px-4 py-2">User</th>
              <th className="border px-4 py-2">Agency</th>
              <th className="border px-4 py-2">Members</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Payment status</th>
              <th className="border px-4 py-2">Booking status</th>
              <th className="border px-4 py-2">Cancelled At</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-6 text-gray-500">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{booking.id}</td>
                  <td className="border px-4 py-2 flex items-center gap-2">
                    {booking.package_image && (
                      <img
                        src={booking.package_image}
                        alt="Package"
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <span>{booking.package_title}</span>
                  </td>
                  <td className="border px-4 py-2">{booking.username}</td>
                  <td className="border px-4 py-2">{booking.agency_name || "-"}</td>
                  <td className="border px-4 py-2">{booking.no_of_members}</td>
                  <td className="border px-4 py-2">₹{booking.amount}</td>
                  <td className="border px-4 py-2">{booking.date}</td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        booking.payment_status === "PAID"
                          ? "bg-green-100 text-green-700"
                          : booking.payment_status === "FAILED"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {booking.payment_status}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        booking.booking_status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : booking.booking_status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {booking.booking_status}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    {booking.cancelled_at
                      ? new Date(booking.cancelled_at).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookingsPage;
