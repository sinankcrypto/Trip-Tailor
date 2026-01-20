import { useState } from "react";
import { useFetchAdminTransaction } from "../hooks/useFetchAdminTransactions";

const AdminTransactionsPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [dateInput, setDateInput] = useState({
    start_date: "",
    end_date: "",
  });
  const [filters, setFilters] = useState({ ordering: "-created_at" });
  const { transactions, summary, pagination, loading, error, loadTransactions } =
    useFetchAdminTransaction(filters);

  const handleApplyDateFilter = () => {
    if (!dateInput.start_date || !dateInput.end_date) {
      toast.error("Please select both start and end date");
      return;
    }

    setFilters((prev) => ({
      ...prev,
      start_date: dateInput.start_date,
      end_date: dateInput.end_date,
      page: 1,
    }));
  };

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: searchInput || undefined,
      page: 1,
    }));
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, ordering: e.target.value });
  };

  const PAGE_SIZE = 10;

  const getCurrentPage = () => {
    if (pagination.next) {
      return Number(new URL(pagination.next).searchParams.get("page")) - 1;
    }
    if (pagination.previous) {
      return Number(new URL(pagination.previous).searchParams.get("page")) + 1;
    }
    return 1; // first page
  };

  const currentPage = getCurrentPage();
  const totalPages = Math.ceil(pagination.count / PAGE_SIZE);

  if (loading) return <p className="text-gray-600 p-4">Loading transactions...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        All Transactions
      </h1>

      {/* ===== Summary Cards ===== */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center shadow-sm">
            <h2 className="text-sm text-gray-600">Total Processed Amount</h2>
            <p className="text-2xl font-semibold text-green-700">
              ₹{summary.total_amount ? summary.total_amount.toLocaleString() : 0}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center shadow-sm">
            <h2 className="text-sm text-gray-600">Total Platform Fees</h2>
            <p className="text-2xl font-semibold text-blue-700">
              ₹{summary.total_platform_fee
                ? summary.total_platform_fee.toLocaleString()
                : 0}
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center shadow-sm">
            <h2 className="text-sm text-gray-600">Total Transactions</h2>
            <p className="text-2xl font-semibold text-yellow-700">
              {summary.total_transactions || 0}
            </p>
          </div>
        </div>
      )}

      {/* ===== Filters ===== */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">

          {/* 🔍 Search */}
          <div className="flex gap-2 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search user or agency"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="border px-3 py-2 rounded-md text-sm w-full lg:w-56 focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition"
            >
              Search
            </button>
          </div>

          {/* 📅 Date Filter */}
          <div className="flex gap-2 w-full lg:w-auto">
            <input
              type="date"
              value={dateInput.start_date}
              onChange={(e) =>
                setDateInput({ ...dateInput, start_date: e.target.value })
              }
              className="border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="date"
              value={dateInput.end_date}
              onChange={(e) =>
                setDateInput({ ...dateInput, end_date: e.target.value })
              }
              className="border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleApplyDateFilter}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
            >
              Apply
            </button>
          </div>

          {/* ↕ Sorting */}
          <div className="w-full lg:w-48">
            <select
              value={filters.ordering}
              onChange={handleSortChange}
              className="border px-3 py-2 rounded-md text-sm w-full focus:ring-2 focus:ring-gray-400"
            >
              <option value="-created_at">Newest First</option>
              <option value="created_at">Oldest First</option>
              <option value="-amount">Highest Amount</option>
              <option value="amount">Lowest Amount</option>
            </select>
          </div>

        </div>
      </div>

      {/* ===== Transactions Table ===== */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-3 text-left">Booking ID</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Agency</th>
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
                <td className="px-4 py-3">{tx.agency_name}</td>
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
      <div className="flex justify-center items-center gap-6 mt-6">
        <button
          disabled={!pagination.previous}
          onClick={() => {
            const page = new URL(pagination.previous).searchParams.get("page");
            loadTransactions({ page });
          }}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm text-gray-600">
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>

        <button
          disabled={!pagination.next}
          onClick={() => {
            const page = new URL(pagination.next).searchParams.get("page");
            loadTransactions({ page });
          }}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminTransactionsPage;
