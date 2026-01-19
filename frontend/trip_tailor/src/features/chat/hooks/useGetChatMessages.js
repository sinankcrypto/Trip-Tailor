import { useEffect, useState } from "react";
import { getChatMessages } from "../services/chatService";

export const useGetChatMessages = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => {
    getChatMessages(chatId).then((data) => {
      setMessages(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  return { messages, loading, refetch: fetchMessages };
};
