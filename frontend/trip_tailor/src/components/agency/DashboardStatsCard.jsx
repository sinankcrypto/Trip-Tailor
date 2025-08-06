import React from 'react'
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';

const iconMap = {
    bookings: <TrendingUp className='text-green-600' />,
    earnings: <DollarSign className='text-blue-600' />,
    today: <Calendar className='text-green-500' />
};

const DashboardStatsCard = ({ title, value, type }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow border border-gray-200">
        <div>
            <h4 className="text-sm text-gray-500">{ title }</h4>
            <p className="text-xl font-bold text-gray-700">{ value }</p>
        </div>
        <div className="text-3xl">{iconMap[type]}</div>
    </div>
)

export default DashboardStatsCard
