import axios from "axios";
const API_URL = "http://localhost:8000/api";

export const fetchFoodTypes = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/food_types/all`);
    return response.data;
  } catch (error) {
    console.error("Error in fetchFoodTypes.");
    throw error;
  }
};

export const addFoodType = async (newTypeName, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/food_types/add/${newTypeName}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in addFoodType.");
    throw error;
  }
};

export const renameFoodType = async (oldName, newName, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/food_types/rename/${oldName}`,
      { name: newName }, // FoodTypeCreate
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in renameFoodType.");
    throw error;
  }
};

export const deleteFoodType = async (typeName, token) => {
  try {
    await axios.delete(`${API_URL}/food_types/delete/${typeName}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error in deleteFoodType.");
    throw error;
  }
};
