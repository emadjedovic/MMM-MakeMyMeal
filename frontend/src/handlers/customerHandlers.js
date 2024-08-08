// services/customerHandlers.js
import {
  fetchNearbyRestaurants,
  fetchRestaurantTypes,
  fetchRecommendedNearbyRestaurants,
  fetchRecommendedItems,
  fetchPromotedItems,
  fetchPromotions,
} from "../services/api";

export const fetchRestaurantsByType = async (
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
    console.error("Error fetching customers restaurants:", error);
  }
};

export const fetchRecommended = async (
  token,
  setRecommendedRestaurants,
  setRecommendedItems
) => {
  try {
    const fetchedRecommendedRestaurants = await fetchRecommendedNearbyRestaurants(token);
    setRecommendedRestaurants(fetchedRecommendedRestaurants);

    const fetchedRecommendedItems = await fetchRecommendedItems(token);
    setRecommendedItems(fetchedRecommendedItems);
  } catch (error) {
    console.error(
      "Error fetching recommended."
    );
  }
};

export const fetchTypes = async (
  token,
  setRestaurantTypes
) => {
  try {
    const types = await fetchRestaurantTypes(token);
    setRestaurantTypes(types);
  } catch (error) {
    console.error(
      "Error fetching types."
    );
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

export const handleTypeSelect = (type, setSelectedType) => {
  setSelectedType(type);
};

//

export const handleRestaurantSelectParent = (restaurantId, setSelectedRestaurantId) => {
  setSelectedRestaurantId(restaurantId);
};

export const handlePopState = (setSelectedRestaurantId) => {
  setSelectedRestaurantId(null);
};
