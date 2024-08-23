import axios from "axios";
const API_URL = "http://localhost:8000/api";

export const fetchRestaurantTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}/restaurant_types/all`);
    return response.data;
  } catch (error) {
    console.error("Error in fetchRestaurantTypes.");
    throw error;
  }
};

export const addRestaurantType = async (token, newTypeName) => {
  try {
    console.log("type name: ", newTypeName);
    const response = await axios.post(
      `${API_URL}/restaurant_types/add/${newTypeName}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in addRestaurantType.");
    throw error;
  }
};

export const renameRestaurantType = async (token, oldName, newName) => {
  try {
    const response = await axios.put(
      `${API_URL}/restaurant_types/rename/${oldName}`,
      { name: newName },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in renameRestaurantType.");
    throw error;
  }
};

export const deleteRestaurantType = async (token, typeName) => {
  try {
    await axios.delete(`${API_URL}/restaurant_types/delete/${typeName}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error in deleteRestaurantType.");
    throw error;
  }
};
