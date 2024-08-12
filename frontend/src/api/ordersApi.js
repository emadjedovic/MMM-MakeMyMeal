import axios from "axios";
const API_URL = "http://localhost:8000/api";

export const fetchOrdersCustomerHistory = async (token, customer_id) => {
  try {
    const response = await axios.get(`${API_URL}/orders/history/${customer_id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in fetchOrdersCustomerHistory.");
    throw error;
  }
};

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
    console.error("Error in fetchOrdersOwner.");
    throw error;
  }
};

export const fetchDeliveriesToday = async (token, delivery_id) => {
  try {
    const response = await axios.get(`${API_URL}/orders/assigned/${delivery_id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in fetchDeliveriesToday.");
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

export const updateOrderStatus = async (token, order_id, newStatus) => {
  try {
    await axios.put(
      `${API_URL}/orders/status/${order_id}/${newStatus}`, {},{},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

  } catch (error) {
    console.error("Error in updateOrderStatus.", error)
    throw error;
  }
}