import React, { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useNavigate } from 'react-router-dom'
import ProfileForm from '../components/ProfileForm'
import ProfileCard from '../components/ProfileCard'
import toast from "react-hot-toast"

const ProfilePage = () => {
  const { profile, loading, error, notFound, saveProfile } = useProfile()
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  if (loading) return <p className="p-4">Loading...</p>
  if (error) return <p className="p-4 text-red-600">{String(error)}</p>;

  if (notFound || !profile) {
    return (
      <div className="p-4">
        <h1 className="font-jakarta text-2xl font-semibold mb-4">Create your profile</h1>
        <ProfileForm
          onSubmit={async (values) => {
            try {
              setSubmitting(true);
              await saveProfile(values); // will call create under the hood
              toast.success("Profile created successfully!");
            } catch (err) {
              // handle validation or generic errors
              const details = err?.response?.data;
              if (typeof details === "object") {
                // show each field error
                Object.entries(details).forEach(([field, msgs]) => {
                  toast.error(`${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`);
                });
              } else {
                toast.error(details || "Failed to create profile");
              }
            } finally {
              setSubmitting(false);
            }
          }}
          submitting={submitting}
        />
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="font-jakarta text-2xl font-semibold mb-4">Your profile</h1>
      <ProfileCard profile={profile} onEdit={() => navigate("/user/profile/edit")} />
    </div>
  )
}

export default ProfilePage
