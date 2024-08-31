import React, { useContext, useEffect, useState } from "react";
import { Card, ListGroup, Container } from "react-bootstrap";
import { UserContext } from "../contexts/UserContext";
import { calculateDistance } from "../calculations";
import { handleFetchRestaurantById } from "../handlers/RestaurantPageHandlers";

function RestaurantCard({ restaurantId, handleRestaurantSelectParent }) {
  const { user, userRole } = useContext(UserContext);
  const [restaurant, setRestaurant] = useState("");

  useEffect(() => {
    handleFetchRestaurantById(restaurantId, setRestaurant);
  }, [restaurantId]);

  return (
    <Container className="my-2">
      <Card
        onClick={() => handleRestaurantSelectParent(restaurantId)}
        className="hover-card"
        style={{ width: "100%" }}
      >
        <Card.Img
          variant="top"
          src={`http://localhost:8000/assets/${restaurant.imageUrl}`}
          alt={restaurant.name}
          style={{ width: "100%", height: "150px", objectFit: "cover" }}
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
        <Card.Text style={{ margin: "1rem", marginTop: "0" }}>
          <i>
            {restaurant.street_name}&nbsp;({restaurant.city})
          </i>
        </Card.Text>
        {userRole === "CUSTOMER" && (
          <>
            <ListGroup className="list-group-flush">
              <ListGroup.Item>
                {calculateDistance(
                  restaurant.latitude,
                  restaurant.longitude,
                  user.latitude,
                  user.longitude
                )}
                {" m from you"}
              </ListGroup.Item>
            </ListGroup>
          </>
        )}
        {(userRole === "ADMIN" || userRole === "RESTAURANT ADMIN") && (
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
    </Container>
  );
}

export default RestaurantCard;
