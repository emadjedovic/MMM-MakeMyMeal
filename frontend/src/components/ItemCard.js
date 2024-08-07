import React, { useState, useEffect } from "react";
import { Card, ListGroup, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchRestaurantById } from "../services/api";

function ItemCard({ item }) {
  const [restaurantName, setRestaurantName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemSelect = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  useEffect(() => {
    const getRestaurantName = async () => {
      try {
        const restaurant = await fetchRestaurantById(item.restaurant_id);
        setRestaurantName(restaurant.name);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      }
    };

    getRestaurantName();
  }, [item.restaurant_id]);

  const isRestaurantPage = location.pathname.startsWith(`/restaurant/${item.restaurant_id}`);

  return (
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
            <strong>PRICE:</strong> {item.price}
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default ItemCard;
