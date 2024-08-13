// src/components/ItemCard.js
import React, { useState, useEffect, useContext } from "react";
import { Card, ListGroup, Button, Container } from "react-bootstrap";
import { UserContext } from "../UserContext";
import AddPromotionModal from "./restaurantadmin/AddPromotionModal";
import Restaurant from "./RestaurantPage";
import { handleFetchRestaurantName } from "../handlers/RestaurantPageHandlers";

function ItemCard({ item, isInRestaurant, refreshItems }) {
  const { userRole } = useContext(UserContext);
  const [restaurantName, setRestaurantName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    handleFetchRestaurantName(item.restaurant_id, setRestaurantName);
  }, [item.restaurant_id]);

  return (
    <Container>
      {selected && !isInRestaurant ? (
        <Restaurant restaurantId={item.restaurant_id} />
      ) : (
        <>
          <Card
            onClick={() => setSelected(true)}
            className="hover-card"
            style={{ width: "100%", display: "flex", flexDirection: "row" }}
          >
            <Card.Img
              variant="left"
              src={`http://localhost:8000/assets/${item.imageUrl}`}
              alt={item.name}
              style={{ width: "30%", objectFit: "cover" }}
            />
            <Card.Body style={{ display: "flex", flexDirection: "column" }}>
              <Card.Title>
                <strong>{item.name}</strong>
                {!isInRestaurant ? { restaurantName } : ""}
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
                        style={{
                          width: "20px",
                          height: "20px",
                          marginLeft: "5px",
                        }}
                      />
                    </span>
                  )}
                </ListGroup.Item>
              </ListGroup>
              {userRole === "RESTAURANT ADMIN" && (
                <Button
                  variant="outline-dark"
                  size="sm"
                  onClick={() => setShowModal(true)}
                  style={{ alignSelf: "flex-end" }}
                >
                  Edit Discount
                </Button>
              )}
            </Card.Body>
          </Card>

          <AddPromotionModal
            show={showModal}
            handleClose={() => setShowModal(false)}
            itemId={item.id}
            refreshItems={refreshItems}
          />
        </>
      )}
    </Container>
  );
}

export default ItemCard;
