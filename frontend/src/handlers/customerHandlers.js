// services/customerHandlers.js
import {
  fetchNearbyRestaurants,
  fetchRestaurantTypes,
  fetchRecommendedRestaurants,
  fetchRecommendedItems,
  fetchPromotedItems,
  fetchPromotions,
} from "../services/api";

export const handleFetchNearbyRestaurants = async (
  token,
  selectedType,
  setNearbyRestaurants
) => {
  try {
    const fetchedNearbyRestaurants = await fetchNearbyRestaurants(
      selectedType,
      token
    );
    setNearbyRestaurants(fetchedNearbyRestaurants);
  } catch (error) {
    console.error("Error in handleFetchNearbyRestaurants.");
  }
};

export const handleFetchRecommended = async (
  token,
  setRecommendedRestaurants,
  setRecommendedItems
) => {
  try {
    const fetchedRecommendedRestaurants = await fetchRecommendedRestaurants(token);
    setRecommendedRestaurants(fetchedRecommendedRestaurants);

    const fetchedRecommendedItems = await fetchRecommendedItems(token);
    setRecommendedItems(fetchedRecommendedItems);
  } catch (error) {
    console.error(
      "Error in handleFetchRecommended."
    );
  }
};

export const handleFetchRestaurantTypes = async (
  token,
  setRestaurantTypes
) => {
  try {
    const types = await fetchRestaurantTypes(token);
    setRestaurantTypes(types);
  } catch (error) {
    console.error(
      "Error in handleFetchRestaurantTypes."
    );
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

export const handleTypeSelect = (type, setSelectedType) => {
  setSelectedType(type);
};

export const handleRestaurantSelectParent = (restaurantId, setSelectedRestaurantId) => {
  setSelectedRestaurantId(restaurantId);
};

export const handlePopState = (setSelectedRestaurantId) => {
  setSelectedRestaurantId(null);
};
