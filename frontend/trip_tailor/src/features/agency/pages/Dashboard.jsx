import React, { useEffect, useState } from "react";
import DashboardStatsCard from "../../../components/agency/DashboardStatsCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import apiClient from "../../../api/apiClient";
import { useAgencyDashboardMetrics } from "../hooks/useAgencyDashboardMetrics";

const Dashboard = () => {
  const [status, setStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // ✅ Agency dashboard metrics (includes weekly data)
  const {
    data: metrics,
    loading: loadingMetrics,
    error: metricsError,
  } = useAgencyDashboardMetrics();

  // Fetch agency profile status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await apiClient.get("agency/profile/status", {
          withCredentials: true,
        });
        setStatus(res.data);
      } catch (err) {
        console.error("Error fetching profile status:", err);
      } finally {
        setLoadingStatus(false);
      }
    };

    fetchStatus();
  }, []);

  if (loadingStatus || loadingMetrics) return <p>Loading...</p>;

  if (!status) return <p>Unable to load profile status</p>;

  if (!status.profile_exists || !status.is_complete) {
    return (
      <div className="text-center text-red-600 font-semibold p-6">
        Please complete your profile to access services.
      </div>
    );
  }

  if (status.status === "rejected") {
    return (
      <div className="text-center text-red-600 font-semibold p-6 space-y-3">
        <p>
          Your profile has been{" "}
          <span className="font-bold">rejected</span>.
        </p>
        {status.rejection_reason && (
          <p className="italic text-red-500">
            Reason: {status.rejection_reason}
          </p>
        )}
        <p className="text-gray-700">
          Please edit the fields with correct information to get verified.
        </p>
      </div>
    );
  }

  if (status.status === "pending") {
    return (
      <div className="text-center text-yellow-600 font-semibold p-6">
        Your profile is under review. Please wait for admin approval.
      </div>
    );
  }

  // ✅ Verified agency dashboard
  if (status.is_verified) {
    if (metricsError) {
      return (
        <div className="text-center text-red-600 font-semibold p-6">
          Failed to load dashboard metrics
        </div>
      );
    }

    const weeklyData = metrics.weekly_data ?? [];

    return (
      <div className="p-6 bg-gray-50 min-h-screen font-[Lexend]">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Agency Dashboard
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardStatsCard
            title="Total Bookings"
            value={metrics.total_bookings}
            type="bookings"
          />

          <DashboardStatsCard
            title="Total Earnings"
            value={`₹${metrics.total_earnings? metrics.total_earnings.toLocaleString():0}`}
            type="earnings"
          />

          <DashboardStatsCard
            title="Today's Bookings"
            value={metrics.today_bookings ?? 0}
            type="today"
          />
        </div>

        {/* Weekly Chart */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Weekly Booking Trends
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return null;
};

export default Dashboard;
