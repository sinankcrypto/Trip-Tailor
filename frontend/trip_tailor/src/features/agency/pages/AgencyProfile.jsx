import React, { useEffect, useState } from 'react'
import { useProfile } from '../hooks/useProfile'

const AgencyProfile = () => {
    const { profile, loading, updateProfile} = useProfile()
    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState({
      agency_name: '',
      phone_number: '',
      address: '',
      description: '',
      profile_pic: null,
      license_document: null,
    });

    useEffect(() => {
      console.log(profile)
    },[])

    const handleEditClick = () => {
      setForm({
        ...profile,
        profile_pic: null, // file inputs are not prefilled
        license_document: null,
      });
      setEditing(true)
    }

    const handleChange = (e) => {
      setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) =>{
      e.preventDefault()
      const formData = new FormData();
      formData.append('agency_name', form.agency_name);
      formData.append('phone_number', form.phone_number);
      formData.append('address', form.address);
      formData.append('description', form.description);

      if (form.profile_pic) formData.append('profile_pic', form.profile_pic);
      if (form.license_document) formData.append('license_document', form.license_document);
      const success = await updateProfile(form)
      if (success) setEditing(false)
    }

    if (loading) return <div className="p-6">Loading...</div>   
    if (!profile) return <div className="p-6 text-red-600">Profile not found.</div>

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto mt-6 font-[Lexend]">
    <h2 className="text-2xl font-bold text-green-700 mb-6">Agency Profile</h2>

    {editing ? (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Agency Name</label>
          <input
            type="text"
            name="agency_name"
            value={form.agency_name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md"
          />
        </div>

        {/* Profile Picture */}
        {profile.profile_pic && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Current Profile Picture:</p>
            <img src={profile.profile_pic} alt="Profile" className="h-24 rounded-md border" />
          </div>
        )}
        <label className="block mb-1 text-sm font-medium text-gray-700">Profile Picture</label>
        <input
          type="file"
          name="profile_pic"
          accept="image/*"
          onChange={(e) => setForm({ ...form, profile_pic: e.target.files[0] })}
          className="w-full border p-2 rounded"
        />

        {/* License Document */}
        {profile.license_document && (
          <div>
            <p className="text-sm text-gray-600 mb-1 mt-4">Current License Document:</p>
            <img src={profile.license_document} alt="License" className="h-24 rounded-md border" />
          </div>
        )}
        <label className="block mb-1 text-sm font-medium text-gray-700">License Document</label>
        <input
          type="file"
          name="license_document"
          accept="image/*"
          onChange={(e) => setForm({ ...form, license_document: e.target.files[0] })}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium"
        >
          Save Profile
        </button>
      </form>
    ) : (
      <div className="space-y-4">
        <div>
          <strong className="text-gray-700">Agency Name:</strong> {profile.agency_name}
        </div>
        <div>
          <strong className="text-gray-700">Address:</strong> {profile.address}
        </div>
        <div>
          <strong className="text-gray-700">Phone:</strong> {profile.phone_number}
        </div>
        <div>
          <strong className="text-gray-700">Description:</strong> {profile.description}
        </div>
        {profile.profile_pic && (
          <div>
            <strong className="text-gray-700 block mb-1">Profile Picture:</strong>
            <img src={`http://localhost:8000${profile.profile_pic}`}  alt="Profile" className="h-24 rounded-md border" />
          </div>
        )}
        {profile.license_document && (
          <div>
            <strong className="text-gray-700 block mb-1">License Document:</strong>
            <img src={`http://localhost:8000${profile.license_document}`}  alt="License" className="h-24 rounded-md border" />
          </div>
        )}
        <div>
          <strong className="text-gray-700">Verified:</strong>{' '}
          {profile.verified ? (
            <span className="text-green-600 font-semibold">Yes</span>
          ) : (
            <span className="text-red-500 font-semibold">No</span>
          )}
        </div>
        <button
          onClick={() => {handleEditClick()}}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium mt-4"
        >
          Edit Profile
        </button>
      </div>
    )}
  </div>
  )
}

export default AgencyProfile
