import React, { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useNavigate } from 'react-router-dom'
import ProfileForm from '../components/ProfileForm'
import ProfileCard from '../components/ProfileCard'
import toast from 'react-hot-toast'

const EditProfilePage = () => {
    const { profile, loading, error, saveProfile } = useProfile()
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()

    if (loading) return <p className="p-4">Loading…</p>;
    if (error)   return <p className="p-4 text-red-600">{String(error)}</p>;
    if (!profile) return <p className="p-4">Profile not found.</p>;

    const handleCancel = () => {
      navigate("/user/profile")
    }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Edit profile</h1>
      <ProfileForm
        initialValues={profile}
        submitting={submitting}
        onCancel={handleCancel}
        onSubmit={async (values) => {
          try {
            setSubmitting(true);
            await saveProfile(values); 
            toast.success("Profile updated succesfully")
            navigate("/user/profile");
          } catch (err) {
            const msg = err?.response?.data?.detail || "Failed to update profile";
            toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
          } finally {
            setSubmitting(false);
          }
        }}
      />
    </div>
  )
}

export default EditProfilePage
