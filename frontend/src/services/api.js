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
    console.error("Error in createAdmin.");
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
    console.error("Error in createDeliveryPersonnel.");
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Error in registerUser.");
    throw error;
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, loginData);
    return response.data;
  } catch (error) {
    console.error("Error in loginUser.");
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
    console.error("Error in toggleArchiveRestaurant.");
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
    console.error("Error in deleteRestaurant.");
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
    console.error("Error in updateRestaurant.");
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
    console.error("Error in createRestaurant.");
    throw error;
  }
};



export const fetchRestaurantsByType = async (selectedType, token) => {
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
    console.error("Error in fetchRestaurantsByType.");
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
    console.error("Error in fetchNearbyRestaurants.");
    throw error;
  }
};

export const fetchRecommendedRestaurants = async (token) => {
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
    return response.data;
  } catch (error) {
    console.error("Error in fetchRecommendedRestaurants.");
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
    console.error("Error in fetchRestaurantsByOwner.");
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
    console.error("Error in fetchRestaurantById.");
    throw error;
  }
};

// RESTAURANT TYPES

export const fetchRestaurantTypes = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/restaurant_types/all`);
    return response.data;
  } catch (error) {
    console.error("Error in fetchRestaurantTypes.");
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
    console.error("Error in addRestaurantType.");
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
    console.error("Error in renameRestaurantType.");
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
    console.error("Error in deleteRestaurantType.");
    throw error;
  }
};

// FOOD TYPES

export const fetchFoodTypes = async () => {
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

// PROMOTIONS

export const fetchPromotions = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/promotions/`);
    return response.data;
  } catch (error) {
    console.error("Error in fetchPromotions.");
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
    return response.data;
  } catch (error) {
    console.error("Error in createPromotion.");
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
    console.error("Error in updatePromotion.");
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
    console.error("Error in deletePromotion.");
    throw error;
  }
};

// ITEMS

export const createItem = async (itemData, token) => {
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

export const fetchOrdersAll = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/orders/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in fetchOrdersAll.");
    throw error;
  }
}

export const fetchOrderById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetchOrderById.");
    throw error;
  }
}