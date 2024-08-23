import React, { useState, useEffect, useContext } from "react";
import { Card, ListGroup, Container, Form, Row, Col } from "react-bootstrap";
import { UserContext } from "../contexts/UserContext";
import AddPromotionModal from "./modals/AddPromotionModal";
import Restaurant from "./RestaurantPage";
import { handleFetchRestaurantName } from "../handlers/RestaurantPageHandlers";
import ThemedButton from "./ThemedButton";

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
          <Card onClick={() => setSelected(true)} className="hover-card">
            <Row noGutters>
              <Col xs={12} md={4}>
                <Card.Img
                  src={`http://localhost:8000/assets/${item.imageUrl}`}
                  alt={item.name}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </Col>
              <Col xs={12} md={8}>
                <Card.Body>
                  <Row>
                    <Col>
                      <Card.Title>
                        <strong>{item.name}</strong>
                        {!isInRestaurant && ` - ${restaurantName}`}
                      </Card.Title>
                    </Col>
                  </Row>
                  <ListGroup className="list-group-flush">
                    <ListGroup.Item>
                      <p
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.food_type_name.toUpperCase()} //{" "}
                        {item.description}
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
                        <Form.Group as={Row}>
                          <Col sm={12} md={8} lg={5} xl={4}>
                            <Form.Control
                              type="number"
                              min="1"
                              value={quantity}
                              onChange={(e) =>
                                setQuantity(parseInt(e.target.value))
                              }
                              className="m-1"
                            />
                          </Col>
                          <Col>
                            <ThemedButton
                              variant="outline-danger"
                              onClick={() =>
                                addItemToOrder(
                                  item.id,
                                  item.name,
                                  item.price,
                                  quantity
                                )
                              }
                              className="m-1"
                            >
                              ADD
                            </ThemedButton>
                          </Col>
                          <Col>
                            <ThemedButton
                              variant="outline-secondary"
                              className="m-1"
                              onClick={() => removeItemFromOrder(item.id)}
                            >
                              Cancel
                            </ThemedButton>
                          </Col>
                        </Form.Group>
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                  {userRole === "RESTAURANT ADMIN" && (
                    <ThemedButton
                      variant="outline-dark"
                      size="sm"
                      onClick={() => setShowModal(true)}
                      className="mt-3"
                    >
                      Edit Discount
                    </ThemedButton>
                  )}
                </Card.Body>
              </Col>
            </Row>
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
