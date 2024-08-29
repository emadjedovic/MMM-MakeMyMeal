import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { handleFetchRestaurantNamesFromItems } from "../handlers/RestaurantPageHandlers";

const RecommendedItems = ({ recommended, handleRestaurantSelectParent }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [restaurantNames, setRestaurantNames] = useState({});

  const itemsPerPage = 3;
  const totalPages = Math.ceil(recommended.length / itemsPerPage);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, totalPages - 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  useEffect(() => {
    handleFetchRestaurantNamesFromItems(recommended, setRestaurantNames);
  }, [recommended, currentIndex]);

  const startIndex = currentIndex * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = recommended.slice(startIndex, endIndex);

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col>
          {currentItems.map((item) => (
            <Row key={item.id} className="mb-1">
              <Col>
                <Card
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleRestaurantSelectParent(item.restaurant_id)
                  }
                >
                  <Card.Img
                    variant="left"
                    src={`http://localhost:8000/assets/${item.imageUrl}`}
                    alt={item.name}
                    style={{ width: "150px", height: "auto" }}
                  />
                  <Card.Body>
                    <Card.Title>
                      <strong>{item.name}</strong>&nbsp;(
                      {restaurantNames[item.restaurant_id]})
                    </Card.Title>
                    <Card.Text>
                      {item.food_type_name.toUpperCase()} // {item.description}
                    </Card.Text>
                    <ListGroup className="list-group-flush">
                      <ListGroup.Item>
                        <strong>PRICE:</strong> {item.price}
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ))}
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col className="text-center m-3">
          <Button
            variant="light"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous"
            style={{ marginRight: "10px" }}
          >
            <FaArrowLeft />
          </Button>
          <Button
            variant="light"
            onClick={handleNext}
            disabled={currentIndex === totalPages - 1}
            aria-label="Next"
          >
            <FaArrowRight />
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default RecommendedItems;
