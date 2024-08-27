import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const PlaceOrderModal = ({
  show,
  handleClose,
  handlePlaceOrder,
  orderItems,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [arrivalTime, setArrivalTime] = useState("");

  const aggregatedItems = orderItems.reduce((acc, item) => {
    const existingItem = acc.find((i) => i.itemId === item.itemId);
    if (existingItem) {
      existingItem.quantity = item.quantity;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);

  const totalPrice = aggregatedItems.reduce((total, item) => {
    return total + item.itemPrice * item.quantity;
  }, 0);

  const handleConfirmOrder = () => {
    console.log("total price:", totalPrice);
    const orderData = {
      payment_method: paymentMethod,
      preferred_arrival_time: arrivalTime
        ? new Date(arrivalTime).toISOString()
        : null,
      items_ids: aggregatedItems.map((item) => item.itemId),
      total_price: totalPrice,
    };
    handlePlaceOrder(orderData);
    handleClose();
  };

  const multiplyPrice = (per_unit, quantity) => {
    return (per_unit * quantity).toFixed(2);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Review and Confirm Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
            {aggregatedItems.map((item) => (
              <li key={item.itemId} style={{ marginBottom: "0.5rem" }}>
                {item.itemName} x{item.quantity} (€
                {multiplyPrice(item.itemPrice, item.quantity)})
              </li>
            ))}
          </ul>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          TOTAL PRICE: €{totalPrice.toFixed(2)}
        </div>
        <Form>
          <Form.Group style={{ marginBottom: "1rem" }}>
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
        <Button
          variant="success"
          onClick={handleConfirmOrder}
          disabled={aggregatedItems.length === 0}
        >
          Confirm Order
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PlaceOrderModal;
