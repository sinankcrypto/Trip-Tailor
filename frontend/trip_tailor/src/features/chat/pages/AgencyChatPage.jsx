import { useParams } from "react-router-dom";
import ChatLayout from "../components/ChatLayout";
import { useSendMessage } from "../hooks/useSendMessage";
import { useGetChatMessages } from "../hooks/useGetChatMessages";

export default function AgencyChatPage() {
  const { chatId } = useParams();

  return (
    <ChatLayout
      chatId={chatId}
      title="Chat with User"
      useFetchMessages={useGetChatMessages}
      useSendMessage={useSendMessage}
      wsUrl={import.meta.env.VITE_WS_URL}
    />
  );
}
