import React, { useState } from "react";
import { Modal, Form, Alert, Button } from "react-bootstrap";
import { assignOrder } from "../../api/ordersApi";

const AssignOrderModal = ({
  show,
  closeModal,
  refreshOrdersParent,
  orderId,
  token,
}) => {
  const [deliveryId, setDeliveryId] = useState("");
  const [message, setMessage] = useState("");
  const [messageVariant, setMessageVariant] = useState("");

  const handleAssign = () => {
    assignOrder(token, orderId, deliveryId)
      .then(() => {
        setMessageVariant("success");
        setMessage("Order assigned successfully!");
        refreshOrdersParent();
      })
      .catch((error) => {
        setMessageVariant("danger");
        setMessage("Failed to assign order. Please try again.");
        console.error("Failed to assign order:");
      });
  };

  const clear = () => {
    setDeliveryId("");
    setMessage("");
    setMessageVariant("");
  };

  const handleClose = () => {
    clear();
    closeModal();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Assign Order #{orderId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && <Alert variant={messageVariant}>{message}</Alert>}
        <Form>
          <Form.Group controlId="formDeliveryId">
            <Form.Label>Choose delivery personnel</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Delivery ID"
              value={deliveryId}
              onChange={(e) => setDeliveryId(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleAssign}>
          Assign
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignOrderModal;
