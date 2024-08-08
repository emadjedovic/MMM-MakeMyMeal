// src/components/ItemCard.js
import React, { useState, useEffect, useContext } from "react";
import { Card, ListGroup, Button, Container } from "react-bootstrap";
//import { useLocation} from "react-router-dom";
import { UserContext } from "../UserContext";
import { getRestaurantName } from "../services/restaurantHandlers";
import AddPromotionModal from "./AddPromotionModal";
import RestaurantPage from "../pages/RestaurantPage";

function ItemCard({ item }) {
  const { userRole } = useContext(UserContext);
  const [restaurantName, setRestaurantName] = useState("");
  const [showModal, setShowModal] = useState(false);
  //const location = useLocation();

  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  const handleItemSelect = (restaurantId) => {
    setSelectedRestaurantId(restaurantId);
  };

  useEffect(() => {
    getRestaurantName(item.restaurant_id, setRestaurantName);
  }, [item.restaurant_id]);
/*
  const isRestaurantPage = location.pathname.startsWith(
    `/restaurant/${item.restaurant_id}`
  );*/

  return (
    <Container className="my-4">
      {selectedRestaurantId ? (
        <RestaurantPage restaurantId={selectedRestaurantId} />
      ) : (
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
            <strong>{item.name}</strong>({restaurantName})
            {/*!isRestaurantPage && ` (${restaurantName})`*/}
          </Card.Title>
          <p>
            {item.food_type_name.toUpperCase()} // {item.description}
          </p>
          <ListGroup className="list-group-flush" style={{ flex: 1 }}>
            <ListGroup.Item>
              <strong>PRICE:</strong>&nbsp;€{item.price}
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
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowModal(true)}
              style={{ alignSelf: "flex-end" }}
            >
              Add Promotion
            </Button>
          )}
        </Card.Body>
      </Card>

      <AddPromotionModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        itemId={item.id}
      />
    </>
      )}
    </Container>
  );
};

export default ItemCard;
