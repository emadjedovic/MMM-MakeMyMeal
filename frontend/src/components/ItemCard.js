// src/components/ItemCard.js
import React, { useState, useEffect, useContext } from "react";
import { Card, ListGroup, Button, Container, Form } from "react-bootstrap";
import { UserContext } from "../UserContext";
import AddPromotionModal from "./restaurantadmin/AddPromotionModal";
import Restaurant from "./RestaurantPage";
import { handleFetchRestaurantName } from "../handlers/RestaurantPageHandlers";

function ItemCard({
  item,
  isInRestaurant,
  refreshItems,
  addItemToOrder,
  removeItemFromOrder,
}) {
  const { userRole } = useContext(UserContext);
  const [restaurantName, setRestaurantName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(false);

  // new
  const [quantity, setQuantity] = useState(1);

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
              style={{ width: "10rem", objectFit: "cover" }}
            />
            <Card.Body style={{ display: "flex", flexDirection: "column" }}>
              <Card.Title>
                <strong>{item.name}</strong>
                {!isInRestaurant ? { restaurantName } : ""}
              </Card.Title>

              <ListGroup className="list-group-flush" style={{ flex: 1 }}>
                <ListGroup.Item>
                  <p>
                    {item.food_type_name.toUpperCase()} // {item.description}
                  </p>
                </ListGroup.Item>
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
                {userRole === "CUSTOMER" && (
                  <ListGroup.Item>
                    <Form.Group
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <Form.Label style={{ margin: "0" }}>Quantity:</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        style={{ width: "4rem" }}
                      />
                      <Button
                        variant="outline-danger"
                        onClick={() =>
                          addItemToOrder(item.id, item.name, quantity)
                        }
                        style={{ marginLeft: "1rem" }}
                      >
                        ADD
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => removeItemFromOrder(item.id)}
                      >
                        REMOVE
                      </Button>
                    </Form.Group>
                  </ListGroup.Item>
                )}
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
