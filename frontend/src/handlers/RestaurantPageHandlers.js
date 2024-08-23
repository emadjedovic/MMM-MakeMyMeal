import { fetchRestaurantById, updateRestaurant } from "../api/restaurantsApi";
import { fetchRestaurantTypes } from "../api/restaurantTypesApi";
import { fetchItemsByFoodType } from "../api/itemsApi";
import { fetchFoodTypes } from "../api/foodTypesApi";

export const handleFetchItemsByFoodType = async (
  setItems,
  restaurantId,
  selectedFoodType
) => {
  try {
    const items = await fetchItemsByFoodType(restaurantId, selectedFoodType);
    setItems(items);
  } catch (error) {
    console.error("Error in handleFetchItemsByFoodType.");
  }
};

export const handleFetchFoodTypes = async (setFoodTypes) => {
  try {
    const foodTypes = await fetchFoodTypes();
    setFoodTypes(foodTypes);
  } catch (error) {
    console.error("Error in handleFetchFoodTypes.");
  }
};

export const handleAddItem = (newItem, items, setItems) => {
  setItems([...items, newItem]);
};

export const handleFetchRestaurantById = async (id, setRestaurant) => {
  const data = await fetchRestaurantById(id);
  setRestaurant(data);
};

export const handleFetchRestaurantName = async (id, setRestaurantName) => {
  try {
    const restaurant = await fetchRestaurantById(id);
    setRestaurantName(restaurant.name);
  } catch (error) {
    console.error("Error in handleFetchFoodTypes.");
  }
};

export const handleFetchRestaurantNamesFromItems = async (
  items,
  setRestaurantNames
) => {
  const names = {};
  for (const item of items) {
    if (!names[item.restaurant_id]) {
      try {
        const response = await fetchRestaurantById(item.restaurant_id);
        names[item.restaurant_id] = response.name;
      } catch (error) {
        console.error("Error in handleFetchRestaurantNamesFromItems.");
      }
    }
  }
  setRestaurantNames(names);
};

export const handleFetchRestaurantNamesFromOrders = async (
  orders,
  setRestaurantNames,
  restaurantNames
) => {
  const names = { ...restaurantNames };
  for (const order of orders) {
    if (!names[order.restaurant_id]) {
      try {
        const response = await fetchRestaurantById(order.restaurant_id);
        names[order.restaurant_id] = response.name;
      } catch (error) {
        console.error("Error in fetchRestaurantNamesFromOrders.");
      }
    }
  }
  setRestaurantNames(names);
};

export const handleFetchRestaurantTypes = async (setRestaurantTypes) => {
  try {
    const types = await fetchRestaurantTypes();
    setRestaurantTypes(types);
  } catch (error) {
    console.error("Error in handleFetchRestaurantTypes.");
  }
};

export const handleUpdateRestaurant = async (
  token,
  updateId,
  requestData,
  onUpdate,
  setMessage
) => {
  if (updateId < 0) {
    alert("Restaurant ID cannot be less than 0.");
    return;
  }
  try {
    console.log("token: ", token);
    console.log("updateID: ", updateId);
    console.log("requestData: ", requestData);
    const data = await updateRestaurant(token, updateId, requestData);
    onUpdate(data);
    setMessage("Restaurant updated successfully!");
  } catch (error) {
    console.error("Error in handleUpdateRestaurant.");
    setMessage("There was an error updating the restaurant.");
  }
};
