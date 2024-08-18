import { toast } from "react-toastify";
import { fetchAllNotifications, deleteNotification, deleteAllNotifications } from "../api/notificationsApi.js"; 

export const handleFetchNotifications = async (token, setNotifications) => {
  try {
    const data = await fetchAllNotifications(token);
    setNotifications(data);
  } catch (error) {
    toast.error("Failed to fetch notifications");
  }
};

export const handleDeleteNotification = async (token, notificationId, notifications, setNotifications) => {
  try {
    await deleteNotification(token, notificationId);
    setNotifications(notifications.filter(n => n.id !== notificationId));
    toast.success("Notification deleted successfully");
  } catch (error) {
    toast.error("Failed to delete notification");
  }
};

export const handleDeleteAllNotifications = async (token, setNotifications) => {
  try {
    await deleteAllNotifications(token);
    setNotifications([]);
    toast.success("All notifications deleted successfully");
  } catch (error) {
    toast.error("Failed to delete all notifications");
  }
};
