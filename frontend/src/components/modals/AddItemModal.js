import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { createItem } from "../../api/itemsApi";

const AddItemModal = ({
  show,
  handleClose,
  foodTypes,
  token,
  restaurantId,
  refreshItems,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("No description");
  const [foodType, setFoodType] = useState("Other");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("item-images/itemDefault.png");
  const [isRecommended, setIsRecommended] = useState(false);

  const handleAddItem = async () => {
    const newItem = {
      name,
      description,
      food_type_name: foodType,
      price,
      imageUrl,
      restaurant_id: restaurantId,
      is_recommended: isRecommended,
      is_promoted: false,
    };

    try {
      await createItem(token, newItem);
      refreshItems();
      handleClose();
      clearStates();
    } catch (error) {
      console.error("Failed to create item from addItemModal:");
    }
  };

  const clearStates = () => {
    setName("");
    setDescription("No description");
    setFoodType("Other");
    setPrice("");
    setImageUrl("item-images/itemDefault.png");
    setIsRecommended(false);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="itemName" className="mb-3">
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="itemDescription" className="mb-3">
            <Form.Label>Description (optional)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="itemType" className="mb-3">
            <Form.Label>Item Type</Form.Label>
            <Form.Control
              as="select"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
            >
              <option value="Other">Select</option>
              {foodTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="itemPrice" className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              required
            />
          </Form.Group>

          <Form.Group controlId="itemImageUrl" className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="itemRecommended" className="mb-3">
            <Form.Check
              type="checkbox"
              label="Recommended"
              checked={isRecommended}
              onChange={(e) => setIsRecommended(e.target.checked)}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleAddItem}>
            Confirm
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddItemModal;
