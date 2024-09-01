import React, { useState, useContext } from "react";
import { Modal, Form, Alert, Button } from "react-bootstrap";
import { createPromotion } from "../../api/promotionsApi";
import { UserContext } from "../../contexts/UserContext";
import { PercentageToFraction } from "../../calculations";

const AddPromotionModal = ({ show, handleClose, itemId, refreshItems }) => {
  const { token } = useContext(UserContext);
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const promotionData = {
    discount_fraction: PercentageToFraction(discountPercentage),
    start_date: startDate || new Date().toISOString().split("T")[0],
    end_date: endDate || null,
    item_id: itemId,
  };

  const handlePromotionSubmit = async () => {
    if (!discountPercentage || !endDate) {
      setError("Discount percentage and end date are required.");
      return;
    }

    try {
      await createPromotion(token, promotionData);
      refreshItems();
      handleClose();
      clearStates();
      setError("");
    } catch (error) {
      console.error("Error in createPromotion.");
      setError("Failed to create promotion. Please try again.");
    }
  };

  const clearStates = () => {
    setDiscountPercentage("");
    setStartDate(new Date().toISOString().split("T")[0]);
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
