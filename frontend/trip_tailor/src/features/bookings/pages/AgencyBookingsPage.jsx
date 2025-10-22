// src/features/bookings/pages/AgencyBookingsPage.jsx
import { useGetAgencyBookings } from "../hooks/useGetAgencyBookings";
import { updateBookingStatus } from "../services/BookingService";
import { useNavigate } from "react-router-dom";

const AgencyBookingsPage = () => {
  const { bookings, loading, error, refetch } = useGetAgencyBookings();
  const navigate = useNavigate();

  const handleStatusChange = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      refetch(); // refresh bookings after update
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Could not update booking status");
    }
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Agency Bookings</h1>

      <table className="w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Package</th>
            <th className="p-3">User</th>
            <th className="p-3">Date</th>
            <th className="p-3">Members</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Payment Status</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{b.package_title}</td>
              <td className="p-3">{b.username}</td>
              <td className="p-3">{b.date}</td>
              <td className="p-3">{b.no_of_members}</td>
              <td className="p-3">₹{b.amount}</td>
              <td className="p-3">{b.payment_status}</td>
              <td className="p-3 flex space-x-2 justify-center">
                {b.payment_status !== "PAID" ? (
                  <button
                    onClick={() => handleStatusChange(b.id, "PAID")}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    Mark Paid
                  </button>
                ) : (
                  <span className="text-gray-500">Paid</span>
                )}

                {/* ✅ Details Button */}
                <button
                  onClick={() => navigate(`/agency/bookings/${b.id}`)}
                  className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgencyBookingsPage;
