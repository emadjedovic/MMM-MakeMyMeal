import axios from "axios";
const API_URL = "http://localhost:8000/api";

export const fetchChats = async (token, userId) => {
  try {
    const response = await axios.get(`${API_URL}/chats/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in fetchChats.");
    throw error;
  }
};

export const fetchNameFromChat = async (token, userId, chatId) => {
    try {
      const response = await axios.get(`${API_URL}/chats/${chatId}/${userId}/name`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error in fetchNameFromChat.");
      throw error;
    }
  };

  export const fetchMessagesFromChat = async (token, chatId) => {
    try {
        const response = await axios.get(`${API_URL}/chats/${chatId}/messages/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
        });
        return response.data;
    } catch (error) {
      console.error("Error in fetchMessagesFromChat.");
      throw error;
    }
  };

  export const createChat = async (token, chatData) => {
    try {
      const response = await axios.post(`${API_URL}/chats/`, chatData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error creating chat:", error);
      throw error;
    }
  };
