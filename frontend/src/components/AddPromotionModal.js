// src/components/AddPromotionModal.js
import React, { useState, useContext } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { createPromotion } from "../services/api";
import { UserContext } from "../UserContext";

const AddPromotionModal = ({ show, handleClose, itemId }) => {
  const { token } = useContext(UserContext);
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  // Convert percentage to fraction
  const PercentageToFraction = (percentage) => {
    return (percentage / 100).toFixed(2); // ensures exactly 2 decimals
  };

  // Format promotion data
  const promotionData = {
    discount_fraction: PercentageToFraction(discountPercentage),
    start_date: startDate || new Date().toISOString().split('T')[0],
    end_date: endDate || null,
    item_id: itemId
  };

  // Handle form submission
  const handlePromotionSubmit = async () => {
    // Validate required fields
    if (!discountPercentage || !endDate) {
      setError("Discount percentage and end date are required.");
      return;
    }

    try {
      await createPromotion(promotionData, token);
      handleClose();
      clearStates();
      setError(""); // Clear any previous error
      // Optionally, you can refresh the item data or show a success message here
    } catch (error) {
      console.error("There was an error creating the promotion!", error);
      setError("Failed to create promotion. Please try again.");
    }
  };

  // Clear form states
  const clearStates = () => {
    setDiscountPercentage("");
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate("");
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Promotion Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group>
            <Form.Label>Discount Percentage</Form.Label>
            <Form.Control
              type="number"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              placeholder="Enter discount percentage"
              min="0"
              step="0.01"
              required
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handlePromotionSubmit}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPromotionModal;
