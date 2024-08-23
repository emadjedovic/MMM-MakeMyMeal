import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import ThemedButton from "../ThemedButton";

const DeleteRestaurantModal = ({ restaurantId, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmDelete = () => {
    onDelete(restaurantId);
    setShowConfirm(false);
  };

  return (
    <>
      <ThemedButton
        variant="danger"
        onClick={() => setShowConfirm(true)}
        style={{ margin: "0.3rem" }}
      >
        Delete
      </ThemedButton>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the restaurant with ID {restaurantId}?
        </Modal.Body>
        <Modal.Footer>
          <ThemedButton
            variant="secondary"
            onClick={() => setShowConfirm(false)}
          >
            Cancel
          </ThemedButton>
          <ThemedButton variant="danger" onClick={handleConfirmDelete}>
            Confirm
          </ThemedButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteRestaurantModal;
