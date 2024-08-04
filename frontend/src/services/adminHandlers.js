import {
    fetchRestaurants,
    fetchRestaurantTypes,
    toggleArchiveRestaurant,
    deleteRestaurant,
    addRestaurantType,
    renameRestaurantType,
    deleteRestaurantType
  } from "../services/api";
  
  export const fetchData = async (selectedType, token, setRestaurants) => {
    try {
      const fetchedRestaurants = await fetchRestaurants(selectedType, token);
      setRestaurants(fetchedRestaurants);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };
  
  export const fetchTypes = async (token, setRestaurantTypes) => {
    try {
      const types = await fetchRestaurantTypes(token);
      setRestaurantTypes(types);
    } catch (error) {
      console.error("Error fetching restaurant types:", error);
    }
  };
  
  export const handleAdd = (newRestaurant, restaurants, setRestaurants) => {
    setRestaurants([...restaurants, newRestaurant]);
  };
  
  export const handleUpdate = (updatedRestaurant, restaurants, setRestaurants) => {
    setRestaurants(
      restaurants.map((restaurant) =>
        restaurant.id === updatedRestaurant.id ? updatedRestaurant : restaurant
      )
    );
  };
  
  export const handleToggleArchive = async (id, token, restaurants, setRestaurants) => {
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
  
  export const handleDelete = async (id, token, restaurants, setRestaurants, setError) => {
    setError("");
    try {
      await deleteRestaurant(id, token);
      setRestaurants(restaurants.filter((restaurant) => restaurant.id !== id));
    } catch (err) {
      setError("There was an error deleting the restaurant.");
      console.error("Error deleting the restaurant:", err);
    }
  };
  
  export const handleAddRestaurantType = async (newTypeName, token, restaurantTypes, setRestaurantTypes) => {
    try {
      const addedType = await addRestaurantType(newTypeName, token);
      console.log("addedType: ", newTypeName);
      setRestaurantTypes([...restaurantTypes, addedType]);
    } catch (error) {
      console.error("Error adding restaurant type:", error);
    }
  };
  
  export const handleRenameRestaurantType = async (oldName, newName, token, restaurantTypes, setRestaurantTypes) => {
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
  
  export const handleDeleteRestaurantType = async (typeName, token, restaurantTypes, setRestaurantTypes) => {
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
  