// components/ChatLayout.jsx
import { useEffect, useRef, useState } from "react";

const WS_URL = import.meta.env.VITE_WS_URL; // ← THIS READS YOUR .env

export default function ChatLayout({
  chatId,
  title = "Chat",
  useFetchMessages,
  useSendMessage,
}) {
  const { messages: initialMessages, loading, refetch } = useFetchMessages(chatId);
  

  const [messages, setMessages] = useState([])
  const [newMsg, setNewMsg] = useState("");
  const socketRef = useRef(null);
  const { send, sending } = useSendMessage(chatId, socketRef);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([]);
  }, [chatId]);

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // WebSocket — Real-time
  useEffect(() => {
    if (!chatId || !WS_URL) return;

    const url = `${WS_URL}${chatId}/`;
    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => console.log("Real-time chat connected");

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // if (data.type === "history") {
      //   setMessages(prev => {
      //     if (prev.some(m => m.id === data.id)) return prev;
      //     return [...prev, {
      //       id: data.id,
      //       content: data.message,
      //       sender: data.sender,
      //       sender_id: data.sender_id,
      //       is_me: data.is_me,
      //       timestamp: data.timestamp,
      //     }];
      //   });
      //   return;
      // }

      if (data.type === "chat_message") {
        setMessages(prev => [...prev, {
          id: data.id,
          content: data.message,
          sender: data.sender,
          sender_id: data.sender_id,
          is_me: data.is_me,
          timestamp: data.timestamp,
        }]);
        return;
      }
    };

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
    <div className="flex flex-col h-[calc(100vh-84px)] max-w-4xl mx-auto bg-gray-100">
      <div className="bg-green-500 text-white shadow-lg flex justify-end">
        <h1 className="text-sm font-semibold py-4 pr-4">{title}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.is_me ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-5 py-3 rounded-2xl shadow-md ${
                msg.is_me
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-900 border"
              }`}
            >
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