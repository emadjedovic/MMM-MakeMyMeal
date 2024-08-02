// src/services/api.js

import axios from "axios";

const API_URL = "http://localhost:8000/api";

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

// ADMIN AND CUSTOMER USERS

export const fetchRestaurantTypes = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/restaurant_types/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant types:", error);
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
