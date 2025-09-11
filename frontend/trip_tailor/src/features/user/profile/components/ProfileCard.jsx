import React from 'react'

const ProfileCard = ({ profile, onEdit }) => {
  return (
    <div className="max-w-xl p-4 rounded-xl shadow bg-white">
      <div className="flex items-center gap-4">
        {profile.profile_pic ? (
          <img
            src={profile.profile_pic}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200" />
        )}
        <div>
          <h2 className="text-xl font-semibold">
            {profile.first_name} {profile.last_name}
          </h2>
          <p className="text-gray-600">{profile.place || "—"}</p>
        </div>
      </div>

      <button
        onClick={onEdit}
        className="mt-4 px-4 py-2 rounded-lg bg-black text-white"
      >
        Edit
      </button>
    </div>
  )
}

export default ProfileCard
