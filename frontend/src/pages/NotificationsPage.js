import React, { useState, useEffect, useContext } from "react";
import { UserContext, userRole, user } from "../UserContext.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchAllNotifications,
  deleteNotification,
  deleteAllNotifications,
} from "../api/notificationsApi.js"; // Update path as necessary

const NotificationsPage = () => {
  
  const { userRole, token, user } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleFetchNotifications = async () => {
      try {
        const data = await fetchAllNotifications(token);
        setNotifications(data);
      } catch (error) {
        toast.error("Failed to fetch notifications");
      }
    };

    handleFetchNotifications();
  }, [token]);

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(token, notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
      toast.success("Notification deleted successfully");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      await deleteAllNotifications(token);
      setNotifications([]);
      toast.success("All notifications deleted successfully");
    } catch (error) {
      toast.error("Failed to delete all notifications");
    }
  };

  return (
    <div>
      <h1>Notifications</h1>
      <button onClick={handleDeleteAllNotifications}>Delete All Notifications</button>
      <ul>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li key={notification.id}>
              <p><strong>Message:</strong> {notification.message}</p>
              <p><strong>Type:</strong> {notification.type}</p>
              <p><strong>Timestamp:</strong> {new Date(notification.timestamp).toLocaleString()}</p>
              <button onClick={() => handleDeleteNotification(notification.id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No notifications available</p>
        )}
      </ul>
      <ToastContainer />
    </div>
  );
};

export default NotificationsPage;
