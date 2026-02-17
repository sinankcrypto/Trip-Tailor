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
import { MarkAllNotificationsRead, markNotficationRead } from "../features/notification/services/notificationService";

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

    toast.custom((t) => (
      <div
        className={`bg-white shadow-lg rounded-lg px-4 py-3 border-l-4 border-green-500 transition ${
          t.visible ? "animate-enter" : "animate-leave"
        }`}
      >
        <p className="font-semibold text-gray-800">{data.title}</p>
        <p className="text-sm text-gray-600 truncate">
          {data.message}
        </p>
      </div>
    ), {
      duration: 2000,
    });
  }, []);

  useNotificationSocket({
    onMessage: handleNewNotification,
    onConnect: () => setConnected(true),
    onDisconnect: () => setConnected(false),
  });

  const markAsRead = async (id) => {
    const notification = notifications.find((n) => n.id === id);
    if(!notification || notification.is_read) return;

    try{
      await markNotficationRead(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );

    setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      toast.error("Failed to mark notification as read");
      console.error("Failed to mark notification as read", err);
    }
    
  };

  const markAllAsRead = async () => {
    try{
      await MarkAllNotificationsRead();

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      toast.error("Failed to mark all as read")
      console.error("Failed to mark all as read", err);
    }
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
