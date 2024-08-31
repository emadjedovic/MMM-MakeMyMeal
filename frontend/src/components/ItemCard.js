import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  ListGroup,
  Container,
  Form,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { UserContext } from "../contexts/UserContext";
import AddPromotionModal from "./modals/AddPromotionModal";
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

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    handleFetchRestaurantName(item.restaurant_id, setRestaurantName);
  }, [item.restaurant_id]);

  return (
    <Container className="p-0">
      {selected && !isInRestaurant ? (
        <Restaurant restaurantId={item.restaurant_id} />
      ) : (
        <>
          <Card
            onClick={() => setSelected(true)}
            className="hover-card"
            style={{
              display: "flex",
              flexDirection: "row",
              cursor: "pointer",
            }}
          >
            <Card.Img
              variant="left"
              src={`http://localhost:8000/assets/${item.imageUrl}`}
              alt={item.name}
              style={{ width: "150px", height: "auto", objectFit: "cover" }}
            />
            <Card.Body style={{ fontSize: "small" }}>
              <Row>
                <Col>
                  <Card.Title>
                    <strong>{item.name}</strong>
                    {!isInRestaurant && ` - ${restaurantName}`}
                  </Card.Title>
                </Col>
              </Row>
              <ListGroup className="list-group-flush">
                <ListGroup.Item className="p-0">
                  <p
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.food_type_name.toUpperCase()} {"//"} {item.description}
                  </p>
                </ListGroup.Item>
                <ListGroup.Item className="pb-0">
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
                        <Button
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
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant="outline-secondary"
                          className="m-1"
                          onClick={() => removeItemFromOrder(item.id)}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Form.Group>
                  </ListGroup.Item>
                )}
              </ListGroup>
              {userRole === "RESTAURANT ADMIN" && (
                <Button
                  size="sm"
                  onClick={() => setShowModal(true)}
                  className="mt-3"
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
