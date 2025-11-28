import { useEffect, useState } from "react";
import { getChatMessages } from "../services/chatService";

export const useGetChatMessages = (packageId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => {
    getChatMessages(packageId).then((data) => {
      setMessages(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchMessages();
  }, [packageId]);

  return { messages, loading, refetch: fetchMessages };
};
