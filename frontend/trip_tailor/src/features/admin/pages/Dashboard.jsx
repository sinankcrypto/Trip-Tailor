import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import apiClient from "../../../api/apiClient";
import { useAdminDashboardMetrics } from "../hooks/useAdminDashboardMetrics";
import { useAdminSalesReport } from "../../admin/hooks/useAdminSalesReport";

const Dashboard = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [format, setFormat] = useState("pdf");

  // ✅ Lifetime dashboard metrics
  const {
    data: metrics,
    loading: loadingMetrics,
    error,
  } = useAdminDashboardMetrics();

    // ===== Handlers =====
  const buildParams = () => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    return params;
  };

  // ✅ Sales report (preview + download)
  const {
    data: report,
    loading: reportLoading,
    fetchReport,
    downloadPDF,
    downloadExcel,
  } = useAdminSalesReport();

  // Fetch admin profile
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await apiClient.get("admin-panel/profile/", {
          withCredentials: true,
        });
        setAdmin(res.data);
      } catch {
        navigate("/admin-panel/login");
      } finally {
        setLoadingAdmin(false);
      }
    };

    fetchAdmin()
    fetchReport(buildParams());
  }, [navigate]);

  if (loadingAdmin || loadingMetrics) return <p>Loading...</p>;
  if (error) return <p>Failed to load dashboard data</p>;

  // ===== Dashboard KPIs =====
  const stats = [
    { label: "Users", value: metrics.total_users },
    { label: "Bookings", value: metrics.total_bookings },
    { label: "Agencies", value: metrics.total_agencies },
    {
      label: "Earnings",
      value: `₹${metrics.total_earnings.toLocaleString()}`,
    },
  ];

  // ===== Monthly bookings chart =====
  const chartData = metrics.monthly_bookings;

  const handlePreview = () => {
    fetchReport(buildParams());
  };

  const handleDownload = () => {
    const params = buildParams();
    format === "pdf"
      ? downloadPDF(params)
      : downloadExcel(params);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">
        Welcome, {admin?.username}!
      </h2>

      {/* ===== KPI Cards ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-4 rounded-xl shadow-sm border text-center"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ===== Monthly Bookings Chart ===== */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">
          Monthly Bookings
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar
              dataKey="bookings"
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== Sales Report Controls ===== */}
      <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
        <h3 className="text-lg font-semibold">Sales Report</h3>

        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-sm text-gray-600">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="block border px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="block border px-3 py-2 rounded-md"
            />
          </div>

          <button
            onClick={handlePreview}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply
          </button>

          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="border px-4 py-2 rounded-md"
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
          </select>

          <button
            onClick={handleDownload}
            disabled={!report}
            className="px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50"
          >
            Download
          </button>
        </div>

        {/* ===== Preview Metrics ===== */}
        {report && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <PreviewCard label="Total Bookings" value={report.metrics.total_bookings} />
            <PreviewCard label="Total Amount" value={`₹${report.metrics.total_amount_transferred.toLocaleString()}`} />
            <PreviewCard label="Platform Fee" value={`₹${report.metrics.total_platform_fee_collected.toLocaleString()}`} />
            <PreviewCard label="New Users" value={report.metrics.new_users_count} />
            <PreviewCard label="New Agencies" value={report.metrics.new_agencies_count} />
            <PreviewCard label="Avg Booking" value={`₹${report.metrics.average_booking_price}`} />
            <PreviewCard label="Avg Platform Fee" value={`₹${report.metrics.average_platform_fee}`} />
          </div>
        )}

        {reportLoading && <p className="text-sm text-gray-500">Loading preview…</p>}
      </div>
    </div>
  );
};

const PreviewCard = ({ label, value }) => (
  <div className="bg-gray-50 border rounded-lg p-4 text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-lg font-semibold mt-1">{value}</p>
  </div>
);

export default Dashboard;
