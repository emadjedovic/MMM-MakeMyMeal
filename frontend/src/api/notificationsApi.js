import axios from "axios";
const API_URL = "http://localhost:8000/api";

export const createNotification = async (token, notificationData) => {
  try {
    const response = await axios.post(
      `${API_URL}/notifications/new/`,
      notificationData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error in createNotification: ");
  }
};

export const fetchNotification = async (token, notificationId) => {
  const response = await axios.get(
    `${API_URL}/notifications/${notificationId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const fetchAllNotifications = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/notifications/all/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in fetchAllNotifications.");
    throw error;
  }
};

export const fetchNotificationsOwner = async (token, ownerId) => {
  try {
    const response = await axios.get(
      `${API_URL}/notifications/owner/${ownerId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetchNotificationsOwner:");
    throw error;
  }
};

export const deleteNotification = async (token, notificationId) => {
  const response = await axios.delete(
    `${API_URL}/notifications/delete/${notificationId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteAllNotifications = async (token) => {
  const response = await axios.delete(`${API_URL}/notifications/delete/all/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
