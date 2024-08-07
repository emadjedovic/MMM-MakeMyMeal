import {
  fetchRestaurants,
  fetchRestaurantTypes,
  fetchFoodTypes,
  toggleArchiveRestaurant,
  deleteRestaurant,
  addRestaurantType,
  renameRestaurantType,
  deleteRestaurantType,
  addFoodType,
  renameFoodType,
  deleteFoodType,
  fetchPromotedItems,
  fetchPromotions,
} from "../services/api";

export const fetchRestaurantsByType = async (
  token,
  selectedType,
  setRestaurants
) => {
  try {
    const fetchedRestaurants = await fetchRestaurants(selectedType, token);
    setRestaurants(fetchedRestaurants);
  } catch (error) {
    console.error("Error in fetchRestaurantByType.", error);
  }
};

export const fetchTypes = async (token, setRestaurantTypes, setFoodTypes) => {
  try {
    const restaurantTypes = await fetchRestaurantTypes(token);

    setRestaurantTypes(restaurantTypes);

    const foodTypes = await fetchFoodTypes(token);
    setFoodTypes(foodTypes);
  } catch (error) {
    console.error("Error in fetchTypes.");
  }
};

export const fetchPromotionData = async (
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
    console.error("Error fetching promotion data.");
  }
};

export const handleAdd = (newRestaurant, restaurants, setRestaurants) => {
  setRestaurants([...restaurants, newRestaurant]);
};

export const handleUpdate = (
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

export const handleToggleArchive = async (
  id,
  token,
  restaurants,
  setRestaurants
) => {
  try {
    await toggleArchiveRestaurant(id, token);
    setRestaurants(
      restaurants.map((restaurant) =>
        restaurant.id === id
          ? { ...restaurant, is_archived: !restaurant.is_archived }
          : restaurant
      )
    );
  } catch (error) {
    console.error("Error archiving restaurant:", error);
  }
};

export const handleTypeSelect = (type, setSelectedType) => {
  setSelectedType(type);
};

export const handleAdminCreated = (rest_admin) => {
  console.log("New restaurant admin created:", rest_admin);
};

export const handleDelete = async (
  id,
  token,
  restaurants,
  setRestaurants,
  setError
) => {
  setError("");
  try {
    await deleteRestaurant(id, token);
    setRestaurants(restaurants.filter((restaurant) => restaurant.id !== id));
  } catch (err) {
    setError("There was an error deleting the restaurant.");
    console.error("Error deleting the restaurant:", err);
  }
};

// RESTAURANT TYPES

export const handleAddRestaurantType = async (
  newTypeName,
  token,
  restaurantTypes,
  setRestaurantTypes
) => {
  try {
    const addedType = await addRestaurantType(newTypeName, token);
    console.log("addedType: ", newTypeName);
    setRestaurantTypes([...restaurantTypes, addedType]);
  } catch (error) {
    console.error("Error adding restaurant type:", error);
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
    const renamedType = await renameRestaurantType(oldName, newName, token);
    console.log(`Renamed ${oldName} to ${newName}.`);
    setRestaurantTypes(
      restaurantTypes.map((type) =>
        type.name === oldName ? renamedType : type
      )
    );
  } catch (error) {
    console.error("Error renaming restaurant type:", error);
  }
};

export const handleDeleteRestaurantType = async (
  typeName,
  token,
  restaurantTypes,
  setRestaurantTypes
) => {
  try {
    await deleteRestaurantType(typeName, token);
    console.log("deletedType: ", typeName);
    setRestaurantTypes(
      restaurantTypes.filter((type) => type.name !== typeName)
    );
  } catch (error) {
    console.error("Error deleting restaurant type:", error);
  }
};

// FOOD TYPES

export const handleAddFoodType = async (
  newTypeName,
  token,
  foodTypes,
  setFoodTypes
) => {
  try {
    const addedType = await addFoodType(newTypeName, token);
    console.log("addedType: ", newTypeName);
    setFoodTypes([...foodTypes, addedType]);
  } catch (error) {
    console.error("Error adding food type:", error);
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
    const renamedType = await renameFoodType(oldName, newName, token);
    console.log(`Renamed ${oldName} to ${newName}.`);
    setFoodTypes(
      foodTypes.map((type) => (type.name === oldName ? renamedType : type))
    );
  } catch (error) {
    console.error("Error renaming food type:", error);
  }
};

export const handleDeleteFoodType = async (
  typeName,
  token,
  foodTypes,
  setFoodTypes
) => {
  try {
    await deleteFoodType(typeName, token);
    console.log("deletedType: ", typeName);
    setFoodTypes(foodTypes.filter((type) => type.name !== typeName));
  } catch (error) {
    console.error("Error deleting food type:", error);
  }
};
