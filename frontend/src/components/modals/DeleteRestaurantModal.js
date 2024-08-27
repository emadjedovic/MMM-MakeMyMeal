import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteRestaurantModal = ({ restaurantId, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmDelete = () => {
    onDelete(restaurantId);
    setShowConfirm(false);
  };

  return (
    <>
      <Button
        variant="danger"
        onClick={() => setShowConfirm(true)}
        style={{ margin: "0.3rem" }}
      >
        Delete
      </Button>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the restaurant with ID {restaurantId}?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirm(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteRestaurantModal;
