import { useEffect, useRef } from "react";

const useNotificationSocket = ({ onMessage, onConnect, onDisconnect }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(
      `${import.meta.env.VITE_WS_BASE_URL}/ws/notifications/`
    );

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Notification socket connected");
      onConnect && onConnect();
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage && onMessage(data);
    };

    socket.onclose = () => {
      console.log("Notification socket disconnected");
      onDisconnect && onDisconnect();
    };

    socket.onerror = (error) => {
      console.error("Notification socket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  return socketRef;
};

export default useNotificationSocket;
