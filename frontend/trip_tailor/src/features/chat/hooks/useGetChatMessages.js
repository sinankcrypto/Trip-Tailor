import { useEffect, useState } from "react";
import { getChatMessages } from "../services/chatService";

export const useGetChatMessages = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getChatMessages(chatId);
      setMessages(data);
    } catch (err) {
      //  normalize error
      if (err.response) {
        // backend responded (like 404, 403, etc.)
        setError({
          status: err.response.status,
          message: err.response.data?.detail || "Something went wrong",
        });
      } else {
        // network error
        setError({
          status: 500,
          message: "Network error. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  return { messages, loading, error, refetch: fetchMessages };
};
