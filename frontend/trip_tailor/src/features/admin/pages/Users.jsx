import React from "react";
import { useFetchUsers } from "../hooks/useFetchUsers";

const Users = () => {
  const { users, loading, pagination, setParams, params } = useFetchUsers();

  return (
    <div className="font-[Lexend]">
      <h1 className="text-2xl font-semibold text-green-700 mb-4">All Users</h1>

      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : (
        <>
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
                    {user.is_active ? "✅" : "❌"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={!pagination.previous}
              onClick={() =>
                setParams((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              className={`px-4 py-2 rounded-md ${
                pagination.previous
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Prev
            </button>

            <span className="text-gray-700">
              Page {params.page} of{" "}
              {Math.ceil(pagination.count / params.page_size)}
            </span>

            <button
              disabled={!pagination.next}
              onClick={() =>
                setParams((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              className={`px-4 py-2 rounded-md ${
                pagination.next
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Users;
