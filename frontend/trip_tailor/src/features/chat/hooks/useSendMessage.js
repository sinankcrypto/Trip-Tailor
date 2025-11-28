import { useState } from "react";
import { sendMessage } from "../services/chatService";

export const useSendMessage = (packageId) => {
  const [sending, setSending] = useState(false);

  const send = async (content) => {
    setSending(true);
    await sendMessage(packageId, content);
    setSending(false);
  };

  return { send, sending };
};
