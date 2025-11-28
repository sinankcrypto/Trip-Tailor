import { useParams } from "react-router-dom";
import ChatLayout from "../components/ChatLayout";
import { useSendMessage } from "../hooks/useSendMessage";
import { useGetChatMessages } from "../hooks/useGetChatMessages";

export default function UserChatPage() {
  const { packageId } = useParams();
  console.log("id", {packageId})

  return (
    <ChatLayout
      chatId={packageId}
      title="Chat with Agency"
      useFetchMessages={useGetChatMessages}
      useSendMessage={useSendMessage}
      wsUrl={import.meta.env.VITE_WS_URL}
    />
  );
}
