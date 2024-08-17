import axios from "axios";
const API_URL = "http://localhost:8000/api";

export const fetchPromotions = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/promotions/`);
    return response.data;
  } catch (error) {
    console.error("Error in fetchPromotions.");
    throw error;
  }
};

export const createPromotion = async (token, promotionData) => {
  try {
    const response = await axios.post(
      `${API_URL}/promotions/create`,
      promotionData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in createPromotion.");
    throw error;
  }
};

export const updatePromotion = async (token, id, updatePromotionData) => {
  try {
    const response = await axios.put(
      `${API_URL}/promotions/update/${id}`,
      updatePromotionData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in updatePromotion.");
    throw error;
  }
};

export const deletePromotion = async (token, id) => {
  try {
    await axios.delete(`${API_URL}/promotions/delete/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error in deletePromotion.");
    throw error;
  }
};
