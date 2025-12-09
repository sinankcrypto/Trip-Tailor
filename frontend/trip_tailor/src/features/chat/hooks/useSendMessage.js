import { useState } from "react";
import { sendMessage } from "../services/chatService";

export const useSendMessage = (chatId, socketRef) => {
  const [sending, setSending] = useState(false);

  const send = async (content) => {
    setSending(true);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message: content }));
    }
    await sendMessage(chatId, content);
    setSending(false);
  };

  return { send, sending };
};
