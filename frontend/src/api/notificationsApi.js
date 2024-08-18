import axios from "axios";
const API_URL = "http://localhost:8000/api";

export const createNotification = async (token, notificationData) => {
  const response = await axios.post(
    `${API_URL}/notifications/new`,
    notificationData,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getNotification = async (token, notificationId) => {
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

export const getAllNotifications = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/notifications/all/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
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
