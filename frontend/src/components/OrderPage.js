import React, { useEffect, useState } from "react";
import { fetchOrderById } from "../api/ordersApi";

const Order = ({ orderId }) => {
  const [orderDetails, setOrderDetails] = useState(null);

  const handleFetchOrderById = async () => {
    try {
      const order = await fetchOrderById(orderId);
      setOrderDetails(order);
    } catch (error) {
      console.error("Error in handleFetchOrderById.");
    }
  };

  useEffect(() => {
    handleFetchOrderById();
  }, [orderId]);

  if (!orderDetails) return <div>Loading...</div>;

  return (
    <div>
      <h2>Order #{orderDetails.id}</h2>
      <p>Restaurant: {orderDetails.restaurant.id}</p>
      <p>Status: {orderDetails.status.value}</p>
      <p>Payment Method: {orderDetails.payment_method.value}</p>
      <p>Total Price: {orderDetails.total_price}</p>
      <p>Created At: {orderDetails.created_at}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default Order;
