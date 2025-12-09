import { Link } from "react-router-dom";
import { useGetUserChatList } from "../hooks/useGetChatList";

export default function UserChatListPage() {
  const { chats, loading } = useGetUserChatList();

  if (loading) return <p>Loading messages...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Messages</h1>

      <div className="space-y-4">
        {chats.map((chat, index) => (
          <Link
            key={index}
            to={`/user/chat/${chat.id}`}
            className="p-4 bg-white shadow rounded-md flex justify-between"
          >
            <div>
              <p className="font-medium">{chat.package_title}</p>
              <p className="text-sm text-gray-600">{chat.agency_name}</p>
              <p className="text-xs text-gray-500">{chat.last_message}</p>
            </div>

            {chat.unread > 0 && (
              <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                {chat.unread}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
