import React, { useEffect, useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import toast from 'react-hot-toast'
import { X } from 'lucide-react' // for close icon

const AgencyProfile = () => {
  const { profile, loading, updateProfile } = useProfile()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    agency_name: '',
    phone_number: '',
    address: '',
    description: '',
    profile_pic: null,
    license_document: null,
  })
  const [errors, setErrors] = useState({})
  const [previewImage, setPreviewImage] = useState(null) // for fullscreen image

  useEffect(() => {
    console.log(profile)
  }, [profile])

  const handleEditClick = () => {
    setForm({
      ...profile,
      profile_pic: null, // file inputs are not prefilled
      license_document: null,
    })
    setEditing(true)
    setErrors({})
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const newErrors = {}

    if (!form.agency_name || !/[a-zA-Z]/.test(form.agency_name)) {
      newErrors.agency_name = 'Agency name must contain letters'
    }

    if (!form.address || !/[a-zA-Z]/.test(form.address)) {
      newErrors.address = 'Address must contain letters'
    }

    if (!form.description || !/[a-zA-Z]/.test(form.description)) {
      newErrors.description = 'Description must contain letters'
    }

    if (!/^\d{10}$/.test(form.phone_number)) {
      newErrors.phone_number = 'Phone number must be 10 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const formData = new FormData()
    formData.append('agency_name', form.agency_name)
    formData.append('phone_number', form.phone_number)
    formData.append('address', form.address)
    formData.append('description', form.description)

    if (form.profile_pic) formData.append('profile_pic', form.profile_pic)
    if (form.license_document) formData.append('license_document', form.license_document)

    try {
      await updateProfile(formData)
      toast.success('Profile saved successfully')
      setEditing(false)
    } catch (err) {
      toast.error(err?.response?.data || 'Error saving profile')
    }
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (!profile) return <div className="p-6 text-red-600">Profile not found.</div>

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto mt-6 font-[Lexend]">
      <h2 className="text-2xl font-bold text-green-700 mb-6">Agency Profile</h2>

      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Agency Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Agency Name
            </label>
            <input
              type="text"
              name="agency_name"
              value={form.agency_name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md"
            />
            {errors.agency_name && (
              <p className="text-red-500 text-sm mt-1">{errors.agency_name}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md"
            />
            {errors.phone_number && (
              <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* File Inputs */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <input
              type="file"
              name="profile_pic"
              accept="image/*"
              onChange={(e) => setForm({ ...form, profile_pic: e.target.files[0] })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              License Document (image)
            </label>
            <input
              type="file"
              name="license_document"
              accept="image/*"
              onChange={(e) => setForm({ ...form, license_document: e.target.files[0] })}
              className="w-full border p-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium mr-3"
          >
            Save Profile
          </button>
          <button
            onClick={()=> setEditing(false)}
            className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md font-medium">
            Cancel
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
              <img
                src={profile.profile_pic}
                alt="Profile"
                className="h-24 rounded-md border cursor-pointer hover:opacity-80 transition"
                onClick={() => setPreviewImage(profile.profile_pic)}
              />
            </div>
          )}

          {/* License Document */}
          {profile.license_document && (
            <div>
              <strong className="text-gray-700 block mb-1">License Document:</strong>
              <img
                src={profile.license_document}
                alt="License"
                className="h-24 rounded-md border cursor-pointer hover:opacity-80 transition"
                onClick={() => setPreviewImage(profile.license_document)}
              />
            </div>
          )}

          <div>
            <strong className="text-gray-700">Verified:</strong>{' '}
            {profile.status === 'verified' ? (
              <span className="text-green-600 font-semibold">Yes</span>
            ) : (
              <span className="text-red-500 font-semibold">No</span>
            )}
          </div>

          <button
            onClick={handleEditClick}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium mt-4"
          >
            Edit Profile
          </button>
        </div>
      )}

      {/* Fullscreen Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-6xl w-full flex justify-center items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-5 right-5 text-white hover:text-gray-300 transition"
              onClick={() => setPreviewImage(null)}
            >
              <X size={32} />
            </button>
            <img
              src={previewImage}
              alt="Full Preview"
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default AgencyProfile
