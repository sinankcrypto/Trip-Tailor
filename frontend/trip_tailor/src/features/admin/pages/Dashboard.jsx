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

const Dashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const navigate = useNavigate();

  // ✅ dashboard metrics hook
  const {
    data: metrics,
    loading: loadingMetrics,
    error,
  } = useAdminDashboardMetrics();

  // Fetch admin profile
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await apiClient.get("admin-panel/profile/", {
          withCredentials: true,
        });
        setAdmin(res.data);
      } catch (err) {
        navigate("/admin-panel/login");
      } finally {
        setLoadingAdmin(false);
      }
    };

    fetchAdmin();
  }, [navigate]);

  if (loadingAdmin || loadingMetrics) return <p>Loading...</p>;
  if (error) return <p>Failed to load dashboard data</p>;

  // ✅ real stats from backend
  const stats = [
    { label: "Users", value: metrics.total_users },
    { label: "Bookings", value: metrics.total_bookings },
    { label: "Agencies", value: metrics.total_agencies },
    {
      label: "Earnings",
      value: `₹${metrics.total_earnings.toLocaleString()}`,
    },
  ];

  // ✅ REAL monthly bookings data
  const chartData = metrics.monthly_bookings;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">
        Welcome, {admin?.username}!
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-4 rounded-xl shadow-sm border text-center"
          >
            <p className="text-lg font-semibold">{stat.label}</p>
            <p className="text-xl mt-2 font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Monthly Bookings Chart */}
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
    </div>
  );
};

export default Dashboard;
