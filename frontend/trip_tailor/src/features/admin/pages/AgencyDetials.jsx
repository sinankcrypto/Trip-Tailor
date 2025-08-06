import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import adminApi from '../../../api/adminApi';

const AgencyDetials = () => {
    const {id} = useParams()
    const [agency, setAgency] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
    const fetchAgency = async () => {
      try {
        const res = await adminApi.get(`agencies/${id}/`);
        setAgency(res.data);
      } catch (err) {
        console.error('Failed to fetch agency:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgency();
  }, [id]);

  const handleVerify = async () => {
    try {
      await adminApi.post(`agencies/${id}/verify/`);
      setAgency(prev => ({ ...prev, is_verified: true }));
      navigate('agencies')
    } catch (err) {
      console.error('Verification failed:', err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  
  return (
    <div className="p-6 font-[Lexend]">
      <h1 className="text-2xl font-semibold text-green-700 mb-4">
        Agency Details
      </h1>

      <div className="bg-white rounded shadow p-4 border border-gray-200 space-y-2">
        <p><strong>ID:</strong> {agency.id}</p>
        <p><strong>Username:</strong> {agency.username}</p>
        <p><strong>Email:</strong> {agency.email}</p>
        <p><strong>Active:</strong> {agency.is_active ? '✅' : '❌'}</p>
        <p><strong>Verified:</strong> {agency.is_verified ? '✅' : '❌'}</p>
        <p><strong>Profile Completed:</strong> {agency.profile_completed ? '✅' : '❌'}</p>
        <p><strong>Phone:</strong> {agency.phone_number || 'N/A'}</p>
        <p><strong>Address:</strong> {agency.address || 'N/A'}</p>
        <p><strong>Description:</strong> {agency.description || 'N/A'}</p>

        {agency.profile_pic && (
          <div>
            <strong>Profile Picture:</strong>
            <img src={agency.profile_pic} alt="Profile" className="h-24 mt-1" />
          </div>
        )}

        {agency.license_document && (
          <div>
            <strong>License Document:</strong>
            <img src={agency.license_document} alt="License" className="h-24 mt-1" />
          </div>
        )}

        {!agency.is_verified && agency.profile_completed && (
          <button
            onClick={handleVerify}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Approve Agency
          </button>
        )}
      </div>
    </div>
  );
};

export default AgencyDetials
