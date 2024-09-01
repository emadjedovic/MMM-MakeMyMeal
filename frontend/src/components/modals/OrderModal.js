import React, { useEffect, useState } from "react";
import { fetchOrderById } from "../../api/ordersApi";
import { handleFetchRestaurantName } from "../../handlers/RestaurantPageHandlers";
import { formatCreatedAt } from "../../calculations";
import { Modal, ListGroup } from "react-bootstrap";

const OrderModal = ({ orderId, showModal, handleClose }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");

  const handleFetchOrderById = async () => {
    try {
      console.log("sending orderID:", orderId);
      const order = await fetchOrderById(orderId);
      setOrderDetails(order);
    } catch (error) {
      console.error("Error in handleFetchOrderById.");
    }
  };

  useEffect(() => {
    handleFetchOrderById();
  }, [orderId]);

  useEffect(() => {
    if (orderDetails && orderDetails.restaurant_id) {
      handleFetchRestaurantName(orderDetails.restaurant_id, setRestaurantName);
    }
  }, [orderDetails]);

  if (!orderDetails) return <div>Loading...</div>;

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <strong>ORDER #{orderDetails.id}</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          <ListGroup.Item>
            <strong>Customer ID:</strong> {orderDetails.customer_id}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Restaurant:</strong> {restaurantName}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Status:</strong> {orderDetails.status}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Delivery ID:</strong> {orderDetails.delivery_id || "NONE"}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Payment Method:</strong> {orderDetails.payment_method}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Total Price:</strong> €{orderDetails.total_price}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Preferred Arrival Time:</strong>{" "}
            {formatCreatedAt(orderDetails.preferred_arrival_time)}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Created At:</strong>{" "}
            {formatCreatedAt(orderDetails.created_at)}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>
              Location: ({orderDetails.latitude.toFixed(5)},{" "}
              {orderDetails.longitude.toFixed(5)})
            </strong>
          </ListGroup.Item>
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default OrderModal;
