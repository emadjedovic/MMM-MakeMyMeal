import axios from "axios";
const API_URL = "http://localhost:8000/api";

export const createItem = async (token, itemData) => {
  try {
    const response = await axios.post(`${API_URL}/items/create`, itemData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in createItem.");
    throw error;
  }
};

export const fetchPromotedItems = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/items/promoted`);

    return response.data;
  } catch (error) {
    console.error("Error in fetchPromotedItems.");
    throw error;
  }
};

export const fetchRecommendedItems = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/items/recommended_nearby`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in fetchRecommendedItems.");
    throw error;
  }
};

export const fetchItemsByFoodType = async (restaurant_id, selectedFoodType) => {
  try {
    const url =
      selectedFoodType === "All"
        ? `${API_URL}/items/restaurant/${restaurant_id}`
        : `${API_URL}/items/search-type/${restaurant_id}/${selectedFoodType}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in fetchItemsByFoodType.");
    throw error;
  }
};
