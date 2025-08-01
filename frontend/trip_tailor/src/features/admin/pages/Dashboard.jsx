import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import adminApi from '../../../api/adminApi'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const Dashboard = () => {

    const [admin, setAdmin] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAdmin = async () => {
            try{
                const res = await adminApi.get('profile/',{
                  withCredentials: true
                })
                setAdmin(res.data)
            } catch(err){
                navigate('/admin-panel/login')
            } finally{
                setLoading(false)
            }
        }

        fetchAdmin()
    },[navigate])

    const stats = [
      { label: 'Users', value: 1280 },
      { label: 'Bookings', value: 452 },
      { label: 'Agencies', value: 32},
      { label: 'Earnings', value: '₹1,75,000' },
    ];

    const chartData = [
      { name: 'Jan', bookings: 50 },
      { name: 'Feb', bookings: 80 },
      { name: 'Mar', bookings: 65 },
      { name: 'Apr', bookings: 120 },
    ];

    if (loading) return <p>Loading...</p>;
    
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Welcome, {admin?.username}!</h2>

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

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Monthly Bookings</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="bookings" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard
