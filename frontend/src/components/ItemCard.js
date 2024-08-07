import React, { useState, useEffect } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchRestaurantById } from "../services/api";

function ItemCard({ item }) {
  const [restaurantName, setRestaurantName] = useState("");
  const navigate = useNavigate();

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

  return (
    <Card
      onClick={() => handleItemSelect(item.restaurant_id)}
      className="hover-card"
      style={{ width: "100%" }}
    >
      <Card.Img
        variant="top"
        src={`http://localhost:8000/assets/${item.imageUrl}`}
        alt={item.name}
        style={{ width: "100%", objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title>
          <strong>{item.name}</strong>&nbsp;({restaurantName})
        </Card.Title>
        <p>
          {item.food_type_name} {item.description}
        </p>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>
          <strong>PRICE:</strong> {item.price}
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
}

export default ItemCard;
