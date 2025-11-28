import { useState } from "react";
import { createOrGetChatSession } from "../services/chatService";

export const useCreateChatSession = () => {
  const [loading, setLoading] = useState(false);

  const createSession = async (packageId) => {
    setLoading(true);
    try {
      return await createOrGetChatSession(packageId);
    } finally {
      setLoading(false);
    }
  };

  return { createSession, loading };
};
