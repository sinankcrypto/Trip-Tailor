import React, { useEffect, useState } from 'react'
import DashboardStatsCard from '../../../components/agency/DashboardStatsCard'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import apiClient from '../../../api/apiClient';

const data = [
  { name: 'Mon', bookings: 5 },
  { name: 'Tue', bookings: 8 },
  { name: 'Wed', bookings: 3 },
  { name: 'Thu', bookings: 7 },
  { name: 'Fri', bookings: 10 },
  { name: 'Sat', bookings: 6 },
  { name: 'Sun', bookings: 9 },
];
const Dashboard = () => {

  const [status, setStatus] = useState(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try{
        const res = await apiClient.get('agency/profile/status');
        setStatus(res.data);

      } catch (err) {
        console.error('Error fetching profile status:', err);
      }
    }

    fetchStatus()
  },[])

  if (!status) return <p>Loading...</p>;

  if (!status.profile_exists || !status.is_complete) {
    return (
      <div className="text-center text-red-600 font-semibold p-6">
        Please complete your profile to access services.
      </div>
    );
  }

  if (!status.is_verified) {
    return (
      <div className="text-center text-yellow-600 font-semibold p-6">
        Your profile is under review. Please wait for admin approval.
      </div>
    );
  }
  return (
      <div className="p-6 bg-gray-50 min-h-screen font-[Lexend]">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Agency Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardStatsCard title="Total Bookings" value="125" type="bookings" />
          <DashboardStatsCard title="Total Earnings" value="₹58,000" type="earnings" />
          <DashboardStatsCard title="Today's Bookings" value="7" type="today" />
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Weekly Booking Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="bookings" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
  )
}

export default Dashboard
