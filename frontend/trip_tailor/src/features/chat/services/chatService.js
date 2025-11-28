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
export const getChatMessages = async (packageId) => {
  const res = await apiClient.get(`/chat/messages/${packageId}/`);
  return res.data;
};

// Send message
export const sendMessage = async (packageId, content) => {
  const res = await apiClient.post(`/chat/messages/${packageId}/`, {
    content,
  });
  return res.data;
};