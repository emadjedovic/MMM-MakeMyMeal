import {
  fetchNearbyRestaurants,
  fetchRecommendedRestaurants,
} from "../api/restaurantsApi";
import { fetchRestaurantTypes } from "../api/restaurantTypesApi";
import { fetchPromotions } from "../api/promotionsApi";
import { fetchRecommendedItems, fetchPromotedItems } from "../api/itemsApi";
import { fetchOrdersCustomerHistory } from "../api/ordersApi";

export const handleFetchOrdersHistory = async (
  token,
  customer_id,
  setOrdersCustomerHistory
) => {
  try {
    const orders = await fetchOrdersCustomerHistory(token, customer_id);

    setOrdersCustomerHistory(orders);
  } catch (error) {
    console.error("Error in handleFetchOrdersHistory.");
  }
};

export const handleFetchNearbyRestaurants = async (
  token,
  selectedType,
  setNearbyRestaurants
) => {
  try {
    const fetchedNearbyRestaurants = await fetchNearbyRestaurants(
      token,
      selectedType
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
    const fetchedRecommendedRestaurants = await fetchRecommendedRestaurants(
      token
    );
    setRecommendedRestaurants(fetchedRecommendedRestaurants);

    const fetchedRecommendedItems = await fetchRecommendedItems(token);
    setRecommendedItems(fetchedRecommendedItems);
  } catch (error) {
    console.error("Error in handleFetchRecommended.");
  }
};

export const handleFetchRestaurantTypes = async (token, setRestaurantTypes) => {
  try {
    const types = await fetchRestaurantTypes(token);
    setRestaurantTypes(types);
  } catch (error) {
    console.error("Error in handleFetchRestaurantTypes.");
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
