import {
  fetchRestaurantsByType,
  toggleArchiveRestaurant,
  deleteRestaurant,
} from "../api/restaurantsApi";
import {
  fetchRestaurantTypes,
  addRestaurantType,
  renameRestaurantType,
  deleteRestaurantType,
} from "../api/restaurantTypesApi";
import {
  fetchFoodTypes,
  addFoodType,
  renameFoodType,
  deleteFoodType,
} from "../api/foodTypesApi";
import { fetchPromotions } from "../api/promotionsApi";
import { fetchPromotedItems } from "../api/itemsApi";
import { fetchOrdersAll, fetchMapOrders } from "../api/ordersApi";

export const handleFetchOrdersAll = async (token, setOrdersAll) => {
  try {
    const ordersAll = await fetchOrdersAll(token);

    setOrdersAll(ordersAll);
  } catch (error) {
    console.error("Error in handleFetchOrdersAll.");
  }
};

export const handleFetchMapOrders = async (
  token,
  restaurantName,
  date,
  deliveryId,
  setOrders
) => {
  try {
    const orders = await fetchMapOrders(
      token,
      restaurantName,
      date,
      deliveryId
    );
    setOrders(orders);
    console.log("orders from handler: ", orders);
  } catch (error) {
    console.error("Error in handleFetchMapOrders: ");
  }
};

export const handleFetchRestaurantsByType = async (
  token,
  selectedType,
  setRestaurants
) => {
  try {
    const fetchedRestaurants = await fetchRestaurantsByType(
      token,
      selectedType
    );
    setRestaurants(fetchedRestaurants);
  } catch (error) {
    console.error("Error in handleFetchRestaurantByType.");
  }
};

export const handleFetchTypes = async (
  token,
  setRestaurantTypes,
  setFoodTypes
) => {
  try {
    const restaurantTypes = await fetchRestaurantTypes(token);

    setRestaurantTypes(restaurantTypes);

    const foodTypes = await fetchFoodTypes(token);
    setFoodTypes(foodTypes);
  } catch (error) {
    console.error("Error in handleFetchTypes.");
  }
};

export const handleFetchPromotionData = async (
  token,
  setPromotedItems,
  setPromotions
) => {
  try {
    const promotedItems = await fetchPromotedItems(token);
    setPromotedItems(promotedItems);

    const promotions = await fetchPromotions(token);
    setPromotions(promotions);
  } catch (error) {
    console.error("Error in handleFetchPromotionData.");
  }
};

export const handleToggleArchiveRestaurant = async (
  id,
  token,
  restaurants,
  setRestaurants
) => {
  try {
    await toggleArchiveRestaurant(token, id);
    setRestaurants(
      restaurants.map((restaurant) =>
        restaurant.id === id
          ? { ...restaurant, is_archived: !restaurant.is_archived }
          : restaurant
      )
    );
  } catch (error) {
    console.error("Error in handleToggleArchiveRestaurant.");
  }
};

export const handleDeleteRestaurant = async (
  id,
  token,
  restaurants,
  setRestaurants,
  setError
) => {
  setError("");
  try {
    await deleteRestaurant(token, id);
    setRestaurants(restaurants.filter((restaurant) => restaurant.id !== id));
  } catch (err) {
    setError("There was an error deleting the restaurant.");
    console.error("Error in handleDeleteRestaurant.");
  }
};

export const handleAddRestaurantType = async (
  newTypeName,
  token,
  restaurantTypes,
  setRestaurantTypes
) => {
  try {
    const addedType = await addRestaurantType(token, newTypeName);
    setRestaurantTypes([...restaurantTypes, addedType]);
  } catch (error) {
    console.error("Error in handleAddRestaurantType.");
  }
};

export const handleRenameRestaurantType = async (
  oldName,
  newName,
  token,
  restaurantTypes,
  setRestaurantTypes
) => {
  try {
    const renamedType = await renameRestaurantType(token, oldName, newName);
    setRestaurantTypes(
      restaurantTypes.map((type) =>
        type.name === oldName ? renamedType : type
      )
    );
  } catch (error) {
    console.error("Error in handleRenameRestaurantType.");
  }
};

export const handleDeleteRestaurantType = async (
  typeName,
  token,
  restaurantTypes,
  setRestaurantTypes
) => {
  try {
    await deleteRestaurantType(token, typeName);
    setRestaurantTypes(
      restaurantTypes.filter((type) => type.name !== typeName)
    );
  } catch (error) {
    console.error("Error in handleDeleteRestaurantType.");
  }
};

export const handleAddFoodType = async (
  newTypeName,
  token,
  foodTypes,
  setFoodTypes
) => {
  try {
    const addedType = await addFoodType(token, newTypeName);
    setFoodTypes([...foodTypes, addedType]);
  } catch (error) {
    console.error("Error in handleAddFoodType.");
  }
};

export const handleRenameFoodType = async (
  oldName,
  newName,
  token,
  foodTypes,
  setFoodTypes
) => {
  try {
    const renamedType = await renameFoodType(token, oldName, newName);
    setFoodTypes(
      foodTypes.map((type) => (type.name === oldName ? renamedType : type))
    );
  } catch (error) {
    console.error("Error in handleRenameFoodType.");
  }
};

export const handleDeleteFoodType = async (
  typeName,
  token,
  foodTypes,
  setFoodTypes
) => {
  try {
    await deleteFoodType(token, typeName);
    setFoodTypes(foodTypes.filter((type) => type.name !== typeName));
  } catch (error) {
    console.error("Error in handleDeleteFoodType");
  }
};

export const handleUpdateRestaurant = (
  updatedRestaurant,
  restaurants,
  setRestaurants
) => {
  setRestaurants(
    restaurants.map((restaurant) =>
      restaurant.id === updatedRestaurant.id ? updatedRestaurant : restaurant
    )
  );
};
