import { toast } from "react-toastify";
import {
  deleteNotification,
  deleteAllNotifications,
  fetchNotificationsOwner,
} from "../api/notificationsApi.js";

export const handleFetchNotificationsOwner = async (
  token,
  setNotifications,
  ownerId
) => {
  try {
    const data = await fetchNotificationsOwner(token, ownerId);
    setNotifications(data);
  } catch (error) {
    toast.error("Failed in handleFetchNotificationsOwner");
  }
};

export const handleDeleteNotification = async (
  token,
  notificationId,
  notifications,
  setNotifications
) => {
  try {
    await deleteNotification(token, notificationId);
    setNotifications(notifications.filter((n) => n.id !== notificationId));
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
