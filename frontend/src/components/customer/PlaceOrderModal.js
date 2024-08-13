import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const PlaceOrderModal = ({ show, handleClose, handlePlaceOrder, orderItems }) => {
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [arrivalTime, setArrivalTime] = useState("");

  const aggregatedItems = orderItems.reduce((acc, item) => {
    const existingItem = acc.find(i => i.itemId === item.itemId);
    if (existingItem) {
      existingItem.quantity = item.quantity;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);

  const handleConfirmOrder = () => {
    const orderData = {
      payment_method: paymentMethod,
      preferred_arrival_time: arrivalTime ? new Date(arrivalTime).toISOString() : null,
      items_ids: aggregatedItems.map(item => item.itemId), // Extract item IDs
    };
    handlePlaceOrder(orderData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Review and Confirm Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
  <div style={{ marginBottom: '1rem' }}>
    <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
      {aggregatedItems.map(item => (
        <li key={item.itemId} style={{ marginBottom: '0.5rem' }}>
          {item.itemName} x{item.quantity}
        </li>
      ))}
    </ul>
  </div>
  <Form>
    <Form.Group style={{ marginBottom: '1rem' }}>
      <Form.Label>Payment Method</Form.Label>
      <Form.Control
        as="select"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="CASH">💵 CASH</option> 
        <option value="CARD">💳 CARD</option>
      </Form.Control>
    </Form.Group>
    <Form.Group>
      <Form.Label>Preferred Arrival Time</Form.Label>
      <Form.Control
        type="datetime-local"
        value={arrivalTime}
        onChange={(e) => setArrivalTime(e.target.value)}
      />
    </Form.Group>
  </Form>
</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleConfirmOrder}>
          Confirm Order
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PlaceOrderModal;
