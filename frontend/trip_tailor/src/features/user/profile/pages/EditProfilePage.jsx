import React, { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useNavigate } from 'react-router-dom'
import ProfileForm from '../components/ProfileForm'
import ProfileCard from '../components/ProfileCard'

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
            await saveProfile(values); // will call update under the hood
            navigate("/user/profile");
          } finally {
            setSubmitting(false);
          }
        }}
      />
    </div>
  )
}

export default EditProfilePage
