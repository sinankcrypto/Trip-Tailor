import React from 'react'
import { useFetchUsers } from '../hooks/useFetchUsers'

const Users = () => {

    const { users, loading } = useFetchUsers();

  return (
    <div className="font-[Lexend]">
      <h1 className="text-2xl font-semibold text-green-700 mb-4">All Users</h1>

      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : (
        <table className="min-w-full bg-white border border-green-200 shadow">
          <thead className="bg-green-100 text-green-800">
            <tr>
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Username</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-green-50">
                <td className="py-2 px-4 border text-center">{user.id}</td>
                <td className="py-2 px-4 border">{user.username}</td>
                <td className="py-2 px-4 border">{user.email}</td>
                <td className="py-2 px-4 border text-center">
                  {user.is_active ? '✅' : '❌'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Users
