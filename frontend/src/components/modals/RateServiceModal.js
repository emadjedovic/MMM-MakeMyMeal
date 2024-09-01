import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { submitCustomerFeedback } from "../../api/customerFeedbackApi.js";

const RateServiceModal = ({ show, closeModal, orderId, token }) => {
  const [restaurantRating, setRestaurantRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const feedbackData = {
      order_id: orderId,
      restaurant_rating: restaurantRating,
      delivery_rating: deliveryRating,
      feedback: feedback,
      would_recommend: wouldRecommend,
    };

    try {
      console.log("feedbackData: ", feedbackData);
      const response = await submitCustomerFeedback(feedbackData);
      console.log("Feedback submitted:", response);
      closeModal();
    } catch (error) {
      console.error("Error in handleSubmit: ");
    }
  };

  return (
    <Modal show={show} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Rate Your Service</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="restaurantRating">
            <Form.Group controlId="deliveryRating">
              <Form.Label>Delivery Rating</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="5"
                step="1"
                value={deliveryRating}
                onChange={(e) => setDeliveryRating(parseInt(e.target.value))}
                required
              />
            </Form.Group>

            <Form.Label>Restaurant Rating</Form.Label>
            <Form.Control
              type="number"
              min="0"
              max="5"
              step="1"
              value={restaurantRating}
              onChange={(e) => setRestaurantRating(parseInt(e.target.value))}
              required
            />
          </Form.Group>

          <Form.Group controlId="wouldRecommend" className="mt-3">
            <Form.Check
              type="checkbox"
              label="Would you recommend this restaurant?"
              checked={wouldRecommend}
              onChange={(e) => setWouldRecommend(e.target.checked)}
            />
          </Form.Group>

          <Form.Group controlId="feedback" className="mt-3">
            <Form.Label>Feedback</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RateServiceModal;
