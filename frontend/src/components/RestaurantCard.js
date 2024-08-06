import React, { useContext } from "react";
import { Card, ListGroup, Row, Col } from "react-bootstrap";
import { UserContext } from "../UserContext";

function RestaurantCard({ restaurant }) {
  const { user } = useContext(UserContext);

  return (
    <Card style={{ width: "100%" }}>
      <Card.Img
        variant="top"
        src={`http://localhost:8000/assets/${restaurant.imageUrl}`}
        alt={restaurant.name}
        style={{ width: "100%", objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title>
          <strong>{restaurant.name}</strong>
        </Card.Title>
        <p>
          {restaurant.type} {restaurant.star_rating}/5 {"\u2B50"}
        </p>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>
          <strong>Street:</strong> {restaurant.street_name}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>City:</strong> {restaurant.city}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Latitude:</strong> {restaurant.latitude}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Longitude:</strong> {restaurant.longitude}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Radius of Delivery:</strong>{" "}
          {restaurant.radius_of_delivery_km} km
        </ListGroup.Item>
        {user.role === "ADMIN" && (
          <>
            <ListGroup.Item>
              <strong>ID:</strong> {restaurant.id}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Owner ID:</strong> {restaurant.owner_id}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Archived:</strong> {restaurant.is_archived ? "Yes" : "No"}
            </ListGroup.Item>
          </>
        )}
      </ListGroup>
    </Card>
  );
}

export default RestaurantCard;
