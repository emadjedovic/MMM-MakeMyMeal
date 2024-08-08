// services/radminHandlers.js
import {
  fetchRestaurantsByOwner,
  updateRestaurant,
  fetchRestaurantTypes,
} from "../services/api";

export const getRestaurants = async (userId, token, setRestaurants) => {
  try {
    const data = await fetchRestaurantsByOwner(userId, token);
    setRestaurants(data);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
  }
};

export const getRestaurantTypes = async (token, setRestaurantTypes) => {
  try {
    const types = await fetchRestaurantTypes(token);
    setRestaurantTypes(types);
  } catch (error) {
    console.error("Error fetching restaurant types:", error);
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
    await updateRestaurant(id, editableData, token);
    setEditId(null);
    setEditableData({});
    const data = await fetchRestaurantsByOwner(userId, token);
    setRestaurants(data);
  } catch (error) {
    console.error("Error updating restaurant:", error);
  }
};

export const handlePageChange = (pageNumber, setCurrentPage) => {
  setCurrentPage(pageNumber);
};

//

export const handleRestaurantSelectParent = (restaurantId, setSelectedRestaurantId) => {
  setSelectedRestaurantId(restaurantId);
};

export const handlePopState = (setSelectedRestaurantId) => {
  setSelectedRestaurantId(null);
};
