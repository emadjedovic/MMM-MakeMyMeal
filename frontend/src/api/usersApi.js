import axios from "axios";
const API_URL = "http://localhost:8000/api";

export const createAdmin = async (token, adminData) => {
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

export const createDeliveryPersonnel = async (token, personnelData) => {
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
