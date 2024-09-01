import {
  fetchRestaurantsByOwner,
  updateRestaurant,
} from "../api/restaurantsApi";
import { fetchOrdersOwner } from "../api/ordersApi";
import { fetchRestaurantTypes } from "../api/restaurantTypesApi";
import { getCustomerFeedbacksByOwner } from "../api/customerFeedbackApi";

export const handleFetchOrdersOwner = async (token, userId, setOrdersOwner) => {
  try {
    const ordersOwner = await fetchOrdersOwner(token, userId);

    setOrdersOwner(ordersOwner);
  } catch (error) {
    console.error("Error in handleFetchOrdersOwner.");
  }
};

export const handleFetchFeedbacksOwner = async (
  token,
  userId,
  setFeedbacksOwner
) => {
  try {
    const feedbacksOwner = await getCustomerFeedbacksByOwner(userId, token);
    setFeedbacksOwner(feedbacksOwner);
  } catch (error) {
    console.error("Error in handleFetchFeedbacksOwner: ");
  }
};

export const handleFetchRestaurantsByOwner = async (
  userId,
  token,
  setRestaurants
) => {
  try {
    const data = await fetchRestaurantsByOwner(token, userId);
    setRestaurants(data);
  } catch (error) {
    console.error("Error in handleFetchRestaurantsByOwner.");
  }
};

export const handleFetchRestaurantTypes = async (token, setRestaurantTypes) => {
  try {
    const types = await fetchRestaurantTypes(token);
    setRestaurantTypes(types);
  } catch (error) {
    console.error("Error in handleFetchRestaurantTypes.");
  }
};

export const handleEditClick = (id, data, setEditId, setEditableData) => {
  setEditId(id);
  setEditableData(data);
};

export const handleChange = (e, editableData, setEditableData) => {
  setEditableData({
    ...editableData,
    [e.target.name]: e.target.value,
  });
};

export const handleSave = async (
  id,
  editableData,
  token,
  userId,
  setEditId,
  setEditableData,
  setRestaurants
) => {
  try {
    await updateRestaurant(token, id, editableData);
    setEditId(null);
    setEditableData({});
    const data = await fetchRestaurantsByOwner(token, userId);
    setRestaurants(data);
  } catch (error) {
    console.error("Error in handleSave.");
  }
};
