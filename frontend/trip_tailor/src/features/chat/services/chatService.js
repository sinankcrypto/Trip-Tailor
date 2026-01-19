import apiClient from "../../../api/apiClient";
export const getUserChats = async () => {
  const res = await apiClient.get("/chat/user/chats/");
  return res.data;
};

// AGENCY chat list
export const getAgencyChats = async () => {
  const res = await apiClient.get("/chat/agency/chats/");
  return res.data;
};

// Fetch messages for a chat (package ID)
export const  getChatMessages = async (chatId) => {
  const res = await apiClient.get(`/chat/messages/${chatId}/`);
  return res.data;
};

// Send message
export const sendMessage = async (chatId, message) => {
  const res = await apiClient.post(`/chat/messages/${chatId}/`, {
    message,
  });
  return res.data;
};

export const createOrGetChatSession = async (packageId) => {
  const res = await apiClient.post(`/chat/package/${packageId}/`);
  return res.data;
}