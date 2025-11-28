import { useState, useEffect } from "react";
import { getUserChats, getAgencyChats } from "../services/chatService";

export const useGetUserChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserChats().then((data) => {
      setChats(data);
      setLoading(false);
    });
  }, []);

  return { chats, loading };
};

export const useGetAgencyChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAgencyChats().then((data) => {
      setChats(data);
      setLoading(false);
    });
  }, []);

  return { chats, loading };
};
