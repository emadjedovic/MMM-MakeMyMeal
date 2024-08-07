import React, { useState, useEffect, useContext } from "react";
import { Card, ListGroup, Button, Modal, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { createPromotion } from "../services/api";
import { UserContext } from "../UserContext";
import { getRestaurantName } from "../services/restaurantHandlers";

function ItemCard({ item }) {
  const { userRole, token } = useContext(UserContext)
  const [restaurantName, setRestaurantName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [promotionDetails, setPromotionDetails] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemSelect = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  const handlePromotionSubmit = async () => {
    try {
      await createPromotion({ itemId: item.id, details: promotionDetails }, token);
      setShowModal(false);
      setPromotionDetails("");
      // Optionally, you can refresh the item data or show a success message here
    } catch (error) {
      console.error("There was an error creating the promotion!", error);
    }
  };

  useEffect(() => {
    getRestaurantName(item.restaurant_id, setRestaurantName);
  }, [item.restaurant_id]);

  const isRestaurantPage = location.pathname.startsWith(`/restaurant/${item.restaurant_id}`);

  return (
    <>
    <Card
      onClick={() => handleItemSelect(item.restaurant_id)}
      className="hover-card"
      style={{ width: "100%", display: "flex", flexDirection: "row" }}
    >
      <Card.Img
        variant="left"
        src={`http://localhost:8000/assets/${item.imageUrl}`}
        alt={item.name}
        style={{ width: "40%", objectFit: "cover" }}
      />
      <Card.Body style={{ display: "flex", flexDirection: "column" }}>
      <Card.Title>
          <strong>{item.name}</strong>
          {!isRestaurantPage && ` (${restaurantName})`}
        </Card.Title>
        <p>
          {item.food_type_name} {item.description}
        </p>
        <ListGroup className="list-group-flush" style={{ flex: 1 }}>
          <ListGroup.Item>
            <strong>PRICE:</strong>&nbsp;{item.price}
            
        {item.is_promoted && (
            <span style={{ color: "red", fontSize: "0.8rem" }}>
            &nbsp;<strong>ON DISCOUNT!</strong>
            <img
              src="/tag-of-war.png"
              alt="Discount Icon"
              style={{ width: "20px", height: "20px", marginLeft: "5px" }}
            />
          </span>
          )}
          </ListGroup.Item>
        </ListGroup>
        {userRole === "RESTAURANT ADMIN" && (
            <Button variant="primary" size="sm" onClick={() => setShowModal(true)} style={{ alignSelf: "flex-end" }}>
              Add Promotion
            </Button>
          )}
      </Card.Body>
    </Card>

    <Modal show={showModal} onHide={() => setShowModal(false)}>
    <Modal.Header closeButton>
      <Modal.Title>Add Promotion</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group>
          <Form.Label>Promotion Details</Form.Label>
          <Form.Control
            type="text"
            value={promotionDetails}
            onChange={(e) => setPromotionDetails(e.target.value)}
            placeholder="Enter promotion details"
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowModal(false)}>
        Close
      </Button>
      <Button variant="primary" onClick={handlePromotionSubmit}>
        Save Promotion
      </Button>
    </Modal.Footer>
    </Modal>
    </>
    
);
}

export default ItemCard;
