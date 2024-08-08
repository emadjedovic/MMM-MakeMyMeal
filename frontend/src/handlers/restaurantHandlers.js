import {
  fetchRestaurantById,
  fetchItemsByFoodType,
  fetchFoodTypes,
  fetchRestaurantTypes,
  updateRestaurant
} from "../services/api";

export const handleFoodTypeSelect = (type_name, setSelectedFoodType) => {
  setSelectedFoodType(type_name);
};

export const handleAddItem = (newItem, items, setItems) => {
  setItems([...items, newItem]);
};

export const getRestaurantById = async (id, setRestaurant) => {
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

export const getRestaurantNames = async (recommended, setRestaurantNames) => {
  const names = {};
  for (const item of recommended) {
    if (!names[item.restaurant_id]) {
      try {
        const response = await fetchRestaurantById(item.restaurant_id);
        names[item.restaurant_id] = response.name;
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      }
    }
  }
  setRestaurantNames(names);
};

export const getRestaurantTypes = async (setRestaurantTypes) => {
  try {
    const types = await fetchRestaurantTypes();
    setRestaurantTypes(types);
  } catch (error) {
    console.error("Error fetching restaurant types:", error);
  }
};

export const handleUpdateRestaurant = async (updateId, requestData, token, onUpdate, setMessage) => {
  if (updateId < 0) {
    alert("Restaurant ID cannot be less than 0.");
    return;
  }
  try {
    const data = await updateRestaurant(updateId, requestData, token);
    onUpdate(data);
    setMessage("Restaurant updated successfully!");
  } catch (error) {
    console.error("There was an error updating the restaurant!", error);
    setMessage("There was an error updating the restaurant.");
  }
};

