import React, { useState, useContext } from "react";
import { Button, Form, Alert, Modal, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { UserContext } from "../UserContext";

const DeleteRestaurant = ({ onDelete }) => {
  const { token } = useContext(UserContext);
  const [restaurantId, setRestaurantId] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setError(""); // Clear previous error
    try {
      if (restaurantId.trim() === "") {
        setError("Restaurant ID cannot be empty.");
        return;
      }
      await axios.delete(
        `http://localhost:8000/api/restaurants/${restaurantId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onDelete(restaurantId);
      setRestaurantId(""); // Clear input after successful deletion
      setShowConfirm(false); // Close the confirmation dialog
    } catch (error) {
      setError("There was an error deleting the restaurant.");
      console.error("There was an error deleting the restaurant!", error);
    }
  };

  const handleDeleteButton = () => {
    setShowConfirm(true);
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <h2>DELETE A RESTAURANT</h2>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Enter restaurant ID"
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              className="mb-2"
            />
          </Form.Group>
          <Button variant="danger" onClick={handleDeleteButton} style={{ margin: '1rem' }}>
            DELETE
          </Button>
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}

          <Modal show={showConfirm} onHide={handleCloseConfirm}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete the restaurant with ID {restaurantId}?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseConfirm}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default DeleteRestaurant;
