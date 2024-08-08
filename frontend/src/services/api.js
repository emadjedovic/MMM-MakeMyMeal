// src/services/api.js
import axios from "axios";
const API_URL = "http://localhost:8000/api";

// USERS

export const createAdmin = async (adminData, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/create/restaurant-admin`,
      adminData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("There was an error creating the admin!", error);
    throw error;
  }
};

export const createDeliveryPersonnel = async (personnelData, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/create/delivery-personnel`,
      personnelData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("There was an error creating the personnel!", error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, loginData);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// RESTAURANTS

export const toggleArchiveRestaurant = async (id, token) => {
  try {
    await axios.put(
      `${API_URL}/restaurants/${id}/toggle_archive`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error archiving restaurant:", error);
    throw error;
  }
};

export const deleteRestaurant = async (id, token) => {
  try {
    await axios.delete(`${API_URL}/restaurants/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    throw error;
  }
};

export const updateRestaurant = async (id, data, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/restaurants/update/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating restaurant:", error);
    throw error;
  }
};



export const createRestaurant = async (restaurantData, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/restaurants/new`,
      restaurantData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("There was an error adding the restaurant!", error);
    throw error;
  }
};



export const fetchRestaurants = async (selectedType, token) => {
  try {
    const url =
      selectedType === "All"
        ? `${API_URL}/restaurants/all`
        : `${API_URL}/restaurants/all/${selectedType}`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};

// CUSTOMER USER

export const fetchNearbyRestaurants = async (selectedType, token) => {
  try {
    const url =
      selectedType === "All"
        ? `${API_URL}/restaurants/nearby`
        : `${API_URL}/restaurants/nearby/${selectedType}`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching nearby restaurants:", error);
    throw error;
  }
};

export const fetchRecommendedNearbyRestaurants = async (token) => {
  try {
    const response = await axios.get(
      `${API_URL}/restaurants/recommended-nearby`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(
      "Success in fetching recommened restaurants nearby!",
      response.data
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recommened restaurants nearby:", error);
    throw error;
  }
};

// RESTAURANT ADMIN USER

export const fetchRestaurantsByOwner = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}/restaurants/owner/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};

export const fetchRestaurantById = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/restaurants/crazy_route/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the restaurant by id!", error);
    throw error;
  }
};

// RESTAURANT TYPES

export const fetchRestaurantTypes = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/restaurant_types/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant types:", error);
    throw error;
  }
};

export const addRestaurantType = async (newTypeName, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/restaurant_types/add/${newTypeName}`,
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
    console.error("Error adding restaurant type:", error);
    throw error;
  }
};

export const renameRestaurantType = async (oldName, newName, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/restaurant_types/rename/${oldName}`,
      { name: newName }, // RestaurantTypeCreate
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error renaming restaurant type:", error);
    throw error;
  }
};

export const deleteRestaurantType = async (typeName, token) => {
  try {
    await axios.delete(`${API_URL}/restaurant_types/delete/${typeName}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting restaurant type:", error);
    throw error;
  }
};

// FOOD TYPES

export const fetchFoodTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}/food_types/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching food types:", error);
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
    console.error("Error adding food type:", error);
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
    console.error("Error renaming food type:", error);
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
    console.error("Error deleting food type:", error);
    throw error;
  }
};

// PROMOTIONS

export const fetchPromotions = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/promotions/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching promotions:", error);
    throw error;
  }
};

export const createPromotion = async (promotionData, token) => {
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
    console.log("Created promotion successfully: ", response.data)
    return response.data;
  } catch (error) {
    console.error("There was an error creating the promotion!", error);
    throw error;
  }
};

export const updatePromotion = async (id, updatePromotionData, token) => {
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
    console.error("Error updating restaurant:", error);
    throw error;
  }
};

export const deletePromotion = async (id, token) => {
  try {
    await axios.delete(`${API_URL}/promotions/delete/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    throw error;
  }
};

// ITEMS

export const createItem = async (itemData, token) => {
  console.log("item data (api.js): ", itemData)
  try {
    const response = await axios.post(
      `${API_URL}/items/create`,
      itemData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("There was an error creating the item!", error);
    throw error;
  }
};

export const fetchPromotedItems = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/items/promoted`);

    return response.data;
  } catch (error) {
    console.error("Error fetching promoted items:", error);
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
    console.log("Success in fetching recommened items!", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching recommended items:", error);
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
    console.log("Success in fetching items of a restaurant!", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching items of a restaurant", error);
    throw error;
  }
};
