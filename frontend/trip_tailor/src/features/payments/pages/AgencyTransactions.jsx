import { useState } from "react";
import { useFetchAgencyTransactions } from "../hooks/useFetchAgencyTransactions";

const AgencyTransactionsPage = () => {
  const [filters, setFilters] = useState({ search: "", ordering: "-created_at" });
  const { transactions, pagination, summary, loading, error, loadTransactions } =
    useFetchAgencyTransactions(filters);

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, ordering: e.target.value });
  };

  if (loading) return <p className="text-gray-600 p-4">Loading transactions...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">
        Agency Transactions
      </h1>

      {/* ===== Summary Section ===== */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center shadow-sm">
            <h2 className="text-sm text-gray-600">Total Earned</h2>
            <p className="text-2xl font-semibold text-green-700">
              ₹{summary.total_earned ? summary.total_earned.toLocaleString() : 0}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center shadow-sm">
            <h2 className="text-sm text-gray-600">Total Transactions</h2>
            <p className="text-2xl font-semibold text-blue-700">
              {summary.total_transactions || 0}
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center shadow-sm">
            <h2 className="text-sm text-gray-600">Platform Fees Paid</h2>
            <p className="text-2xl font-semibold text-yellow-700">
              ₹{summary.total_platform_fee
                ? summary.total_platform_fee.toLocaleString()
                : 0}
            </p>
          </div>
        </div>
      )}

      {/* ===== Filters ===== */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by booking ID..."
          value={filters.search}
          onChange={handleSearch}
          className="border px-4 py-2 rounded-md w-full md:w-1/3"
        />
        <select
          value={filters.ordering}
          onChange={handleSortChange}
          className="border px-4 py-2 rounded-md w-full md:w-1/4"
        >
          <option value="-created_at">Newest First</option>
          <option value="created_at">Oldest First</option>
          <option value="-amount">Highest Amount</option>
          <option value="amount">Lowest Amount</option>
        </select>
      </div>

      {/* ===== Transactions Table ===== */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-3 text-left">Booking ID</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Platform Fee</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{tx.booking_id}</td>
                <td className="px-4 py-3">{tx.user_username}</td>
                <td className="px-4 py-3">₹{tx.amount}</td>
                <td className="px-4 py-3 text-gray-500">₹{tx.platform_fee}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      tx.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : tx.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(tx.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== Pagination ===== */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={!pagination.previous}
          onClick={() =>
            loadTransactions({ page: pagination.previous?.split("page=")[1] })
          }
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          disabled={!pagination.next}
          onClick={() =>
            loadTransactions({ page: pagination.next?.split("page=")[1] })
          }
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AgencyTransactionsPage;
