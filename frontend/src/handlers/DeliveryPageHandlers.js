import { fetchDeliveriesToday, updateOrderStatus } from "../api/ordersApi";

export const handleFetchDeliveriesToday = async (
  token,
  userId,
  setDeliveriesToday
) => {
  try {
    const deliveries = await fetchDeliveriesToday(token, userId);

    setDeliveriesToday(deliveries);
  } catch (error) {
    console.error("Error in handleFetchDeliveriesToday.");
  }
};

export const handleUpdateOrderStatus = async (token, order_id, newStatus) => {
  try {
    await updateOrderStatus(token, order_id, newStatus);
    console.log(`Order ${order_id} status updated to ${newStatus}`);
  } catch (error) {
    console.error("Error in handleUpdateOrderStatus.");
  }
};
