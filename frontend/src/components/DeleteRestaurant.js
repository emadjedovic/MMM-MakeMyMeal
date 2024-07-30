import React, { useState, useContext } from "react";
import { Button, Form, Alert, Modal } from "react-bootstrap";
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
            'Content-Type': 'application/json',
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
    <div className="d-flex align-items-center">
      <Form.Group className="mr-2">
        <Form.Control
          type="text"
          placeholder="Enter restaurant ID"
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value)}
        />
      </Form.Group>
      <Button variant="danger" onClick={handleDeleteButton}>
        Delete Restaurant
      </Button>
      {error && <Alert variant="danger" className="ml-3">{error}</Alert>}

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
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleteRestaurant;
