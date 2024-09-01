import axios from "axios";
const API_URL = "http://localhost:8000/api";

export const toggleArchiveRestaurant = async (token, id) => {
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

export const fetchOwnerId = async (restaurantId) => {
  try {
    const response = await axios.get(
      `${API_URL}/restaurants/${restaurantId}/owner_id`
    );
    return response.data.owner_id;
  } catch (error) {
    console.error("Error in fetchOwnerId.");
    throw error;
  }
};

export const deleteRestaurant = async (token, id) => {
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

export const updateRestaurant = async (token, id, data) => {
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

export const createRestaurant = async (token, restaurantData) => {
  try {
    console.log("sending data: ", restaurantData);
    const response = await axios.post(
      `${API_URL}/restaurants/new`,
      restaurantData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      }
    );
    return response.data;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout:", error.message);
    } else {
      console.error("Error in createRestaurant: ");
    }
    throw error;
  }
};

export const fetchRestaurantsByType = async (token, selectedType) => {
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

export const fetchNearbyRestaurants = async (token, selectedType) => {
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

export const fetchRestaurantsByOwner = async (token, userId) => {
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
