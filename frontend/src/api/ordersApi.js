import axios from "axios";
const API_URL = "http://localhost:8000/api";

export const fetchOrdersCustomerHistory = async (token, customer_id) => {
  try {
    const response = await axios.get(
      `${API_URL}/orders/history/${customer_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetchOrdersCustomerHistory.");
    throw error;
  }
};

export const fetchMapOrders = async (
  token,
  restaurantName,
  date,
  deliveryId
) => {
  try {
    console.log("sending data: ", restaurantName, date, deliveryId);
    const response = await axios.get(`${API_URL}/orders/map/`, {
      params: {
        restaurant_name: restaurantName,
        date: date,
        delivery_id: deliveryId || undefined,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response data: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in fetchMapOrders (ordersApi axios)");
    throw error;
  }
};

export const fetchOrdersOwner = async (token, owner_id) => {
  try {
    console.log("token: ", token);
    console.log("owner_id: ", owner_id);
    const response = await axios.get(`${API_URL}/orders/owner/${owner_id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response.data: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in fetchOrdersOwner.");
    throw error;
  }
};

export const fetchDeliveriesToday = async (token, delivery_id) => {
  try {
    const response = await axios.get(
      `${API_URL}/orders/assigned/${delivery_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
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

export const fetchOrderById = async (id) => {
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
    if (newStatus === "IN PROGRESS") {
      newStatus = "IN_PROGRESS";
    }

    await axios.put(
      `${API_URL}/orders/status/${order_id}/${newStatus}`,
      {},
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error in updateOrderStatus.");
    throw error;
  }
};

export const assignOrder = async (token, orderId, deliveryId) => {
  try {
    await axios.put(`${API_URL}/orders/assign/${orderId}/${deliveryId}`, null, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error in assignOrder.");
    throw error;
  }
};

export const placeOrder = async (token, customer_id, orderData) => {
  try {
    const response = await axios.post(
      `${API_URL}/orders/new/${customer_id}`,
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in placeOrder.");
    throw error;
  }
};
