// services/customerHandlers.js
import {
  fetchNearbyRestaurants,
  fetchRestaurantTypes,
  fetchRecommendedNearbyRestaurants,
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

export const fetchOtherData = async (
  token,
  setRestaurantTypes,
  setRecommendedRestaurants
) => {
  try {
    const types = await fetchRestaurantTypes(token);
    setRestaurantTypes(types);

    const fetchedRecommended = await fetchRecommendedNearbyRestaurants(token);
    setRecommendedRestaurants(fetchedRecommended);
  } catch (error) {
    console.error("Error fetching restaurant types and recommended restaurants.");
  }
};

export const handleTypeSelect = (type, setSelectedType) => {
  setSelectedType(type);
};
