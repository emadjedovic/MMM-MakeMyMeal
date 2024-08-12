import axios from "axios";
const API_URL = "http://localhost:8000/api";

export const fetchOrdersOwner = async (token, owner_id) => {
  try {
    const response = await axios.get(`${API_URL}/orders/owner/${owner_id}`, {
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
};

export const fetchOrderById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetchOrderById.");
    throw error;
  }
};
