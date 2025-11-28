// components/ChatLayout.jsx
import { useEffect, useRef, useState } from "react";

const WS_URL = import.meta.env.VITE_WS_URL; // ← THIS READS YOUR .env

export default function ChatLayout({
  chatId,
  title = "Chat",
  useFetchMessages,
  useSendMessage,
}) {
  const { messages, loading, refetch } = useFetchMessages(chatId);
  const { send, sending } = useSendMessage(chatId);

  const [newMsg, setNewMsg] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // WebSocket — Real-time + JWT from cookie
  useEffect(() => {
    if (!chatId || !WS_URL) return;

    // Get token from cookie
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("No JWT token — user not logged in");
      return;
    }

    const url = `${WS_URL}${chatId}/?token=${token}`;
    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => console.log("Real-time chat connected");
    socketRef.current.onclose = () => console.log("Chat disconnected");
    socketRef.current.onerror = (e) => console.error("WS Error:", e);

    return () => socketRef.current?.close();
  }, [chatId]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;
    await send(newMsg);
    setNewMsg("");
  };

  if (loading) return <p className="text-center py-10">Loading chat...</p>;

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gray-100">
      <div className="bg-green-600 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.is_self ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-5 py-3 rounded-2xl shadow-md ${
                msg.is_self
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-900 border"
              }`}
            >
              <p className="text-sm font-medium mb-1">
                {msg.is_self ? "You" : msg.sender}
              </p>
              <p>{msg.content}</p>
              <p className="text-xs mt-2 opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-green-600"
          />
          <button
            onClick={handleSend}
            disabled={sending || !newMsg.trim()}
            className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 transition font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}