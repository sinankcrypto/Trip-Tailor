import { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";

const useGetNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await apiClient.get("/notifications/", {
          withCredentials: true,
        });

        const data = res.data.results || [];

        setNotifications(data);

        const unread = await apiClient.get("/notifications/unread_count/")
        setUnreadCount(unread.data.unread);

      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
  };
};

export default useGetNotifications;
