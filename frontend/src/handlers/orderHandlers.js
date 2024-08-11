// services/orderHandlers.js
import {
    fetchOrdersAll,
    fetchOrderById
  } from "../services/api";
  
  export const handleOrderSelectParent = (orderId, setSelectedOrderId) => {
    setSelectedOrderId(orderId);
  };
  
  export const handleFetchOrdersAll = async(token, setOrdersAll) => {
    try {
      const ordersAll = await fetchOrdersAll(token);
  
      setOrdersAll(ordersAll);
  
    } catch (error) {
      console.error("Error in handleFetchOrdersAll.")
    }
  }

  export const handleFetchOrderById = async (orderId) => {
    try {
        const order = await fetchOrderById(orderId);

        return order
      } catch (error) {
        console.error("Error in handleFetchOrderById.")
      }
  }