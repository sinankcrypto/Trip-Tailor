import React from 'react'

const ProfileCard = ({ profile, onEdit }) => {
  return (
    <div className="max-w-xl p-4 rounded-xl shadow bg-white font-[Lexend]">
      {/* Profile header */}
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

      {/* Contact Info */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Contact Information
        </h3>
        <div className="text-gray-700 space-y-1">
          <p>
            <span className="font-medium">📞 Phone:</span>{" "}
            {profile.phone_number || "—"}
          </p>
          <p>
            <span className="font-medium">✉️ Email:</span>{" "}
            {profile.email || "—"}
          </p>
        </div>
      </div>

      {/* Edit button */}
      <button
        onClick={onEdit}
        className="mt-6 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
      >
        Edit
      </button>
    </div>
  )
}

export default ProfileCard
