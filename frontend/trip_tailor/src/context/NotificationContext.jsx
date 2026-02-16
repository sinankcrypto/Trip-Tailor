import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import toast from "react-hot-toast";
import useNotificationSocket from "../features/notification/hooks/useNotificationSocket";
import useGetNotifications from "../features/notification/hooks/useGetNotification";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const {
    notifications: initialNotifications,
    unreadCount: initialUnread,
    loading,
  } = useGetNotifications();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);

  // Initialize state after fetch
  useEffect(() => {
    if (!loading) {
      setNotifications(initialNotifications);
      setUnreadCount(initialUnread);
    }
  }, [loading, initialNotifications, initialUnread]);

  // Handle incoming real-time notification
  const handleNewNotification = useCallback((data) => {
    setNotifications((prev) => {
      // prevent duplicates
      if (prev.some((n) => n.id === data.id)) return prev;
      return [data, ...prev];
    });

    if (!data.is_read) {
      setUnreadCount((prev) => prev + 1);
    }

    toast(data.title);
  }, []);

  useNotificationSocket({
    onMessage: handleNewNotification,
    onConnect: () => setConnected(true),
    onDisconnect: () => setConnected(false),
  });

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      )
    );

    setUnreadCount((prev) => Math.max(prev - 1, 0));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        connected,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
