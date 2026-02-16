import { useEffect, useRef } from "react";
import { Check, CheckCheck } from "lucide-react";
import { useNotifications } from "../../../context/NotificationContext";
import { useNavigate } from "react-router-dom";

const NotificationDropdown = ({ isOpen, onClose }) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Example navigation logic
    if (notification.chat_session) {
      navigate(`/chat/${notification.chat_session}`);
    }

    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold text-gray-800">
          Notifications
        </h3>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
          >
            <CheckCheck size={16} />
            Mark all
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="p-4 text-sm text-gray-500 text-center">
            No notifications yet.
          </p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 border-b cursor-pointer transition ${
                notification.is_read
                  ? "bg-white"
                  : "bg-green-50"
              } hover:bg-gray-50`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">
                    {notification.title}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    {notification.message}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>

                {!notification.is_read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Check size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
