import React, { useEffect, useState } from "react";
import { handleFetchOrderById } from "../handlers/orderHandlers";

const Order = ({ orderId }) => {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const data = handleFetchOrderById(orderId);
    setOrderDetails(data);
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
