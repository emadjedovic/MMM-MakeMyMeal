import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, ListGroup, Row, Col } from "react-bootstrap";
import { UserContext } from "../UserContext";
import { calculateDistance } from "../services/distance";

function RestaurantCard({ restaurant }) {
  const { user } = useContext(UserContext);
  
  const navigate = useNavigate();

  const handleRestaurantSelect = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };


  return (
    <Card onClick={() => handleRestaurantSelect(restaurant.id)}
    className="hover-card" style={{ width: "100%" }}>
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
        <div className="text-muted">
          {restaurant.type_name ? restaurant.type_name : "Other"}
          &nbsp;{"\u2B50 "}
          {restaurant.star_rating}/5
        </div>
      </Card.Body>
      <Card.Text style={{ margin: "1rem", marginTop:"0" }}>
        <i>
          {restaurant.street_name} ({restaurant.city})
        </i>
      </Card.Text>
      {user.role === "CUSTOMER" && (
        <>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>
              {calculateDistance(
                restaurant.latitude,
                restaurant.longitude,
                user.latitude,
                user.longitude
              )}{" "}
              km from you
            </ListGroup.Item>
          </ListGroup>
        </>
      )}
      {(user.role === "ADMIN" || user.role === "RESTAURANT ADMIN") && (
        <ListGroup>
          <ListGroup.Item>
            <strong>ID:</strong> {restaurant.id}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Owner ID:</strong> {restaurant.owner_id}
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
          <ListGroup.Item>
            <strong>Archived:</strong> {restaurant.is_archived ? "Yes" : "No"}
          </ListGroup.Item>
        </ListGroup>
      )}
    </Card>
  );
}

export default RestaurantCard;
