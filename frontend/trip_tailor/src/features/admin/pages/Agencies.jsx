import React, { useEffect, useState } from 'react'
import { useFetchAgencies } from '../hooks/useFetchAgencies'
import { useNavigate } from 'react-router-dom'

const Agencies = () => {

    const { agencies, loading} = useFetchAgencies()
    const navigate = useNavigate()

  
  return (
    <div className="font-[Lexend]">
      <h1 className="text-2xl font-semibold text-green-700 mb-4">All Agencies</h1>

      {loading ? (
        <p className="text-gray-600">Loading Agencies...</p>
      ) : (
        <table className="min-w-full bg-white border border-green-200 shadow">
          <thead className="bg-green-100 text-green-800">
            <tr>
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Agency name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Active</th>
              <th className="py-2 px-4 border">is Verified</th>
              <th className="py-2 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {agencies.map((agency) => (
              <tr key={agency.id} className="hover:bg-green-50">
                <td className="py-2 px-4 border text-center">{agency.id}</td>
                <td className="py-2 px-4 border">{agency.username}</td>
                <td className="py-2 px-4 border">{agency.email}</td>
                <td className="py-2 px-4 border text-center">
                  {agency.is_active ? '✅' : '❌'}
                </td><td className="py-2 px-4 border text-center">
                  {agency.verified ? '✅' : '❌'}
                </td>
                <td className="px-4 py-2 text-center">
                <button
                  onClick={() => navigate(`/admin-panel/agencies/${agency.id}`)}
                  className="bg-gray-200 text-gray-800 px-4 py-1 rounded-md hover:bg-gray-300 transition"
                >
                  Details
                </button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Agencies
