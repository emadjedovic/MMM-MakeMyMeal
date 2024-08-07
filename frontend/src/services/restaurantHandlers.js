import {
  fetchRestaurantById,
  fetchItemsByFoodType,
  fetchFoodTypes,
} from "./api";

export const handleFoodTypeSelect = (type_name, setSelectedFoodType) => {
  setSelectedFoodType(type_name);
};

export const handleAddItem = (newItem, items, setItems) => {
  setItems([...items, newItem]);
};

export const getRestaurant = async (id, setRestaurant) => {
  const data = await fetchRestaurantById(id);
  setRestaurant(data);
};

export const getItems = async (restaurantId, selectedFoodType, setItems) => {
  const data = await fetchItemsByFoodType(restaurantId, selectedFoodType);
  setItems(data);
};

export const getFoodTypes = async (setFoodTypes) => {
  const data = await fetchFoodTypes();
  setFoodTypes(data);
};

export const getRestaurantName = async (id, setRestaurantName) => {
  try {
    const restaurant = await fetchRestaurantById(id);
    setRestaurantName(restaurant.name);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
  }
};

