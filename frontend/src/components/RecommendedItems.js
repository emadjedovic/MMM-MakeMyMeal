import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Card, ListGroup } from "react-bootstrap";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { fetchRestaurantById } from "../services/api"; // Import your API fetching function
import Restaurant from "./Restaurant";

const RecommendedItems = ({ recommended }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [restaurantNames, setRestaurantNames] = useState({});

  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  const handleItemSelect = (restaurantId) => {
    setSelectedRestaurantId(restaurantId);
  };


  const itemsPerPage = 3;
  const totalPages = Math.ceil(recommended.length / itemsPerPage);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, totalPages - 1)
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };


  const fetchRestaurantNames = async () => {
    const names = {};
    for (const item of recommended) {
      if (!names[item.restaurant_id]) {
        try {
          const response = await fetchRestaurantById(item.restaurant_id);
          names[item.restaurant_id] = response.name;
        } catch (error) {
          console.error("Error fetching restaurant:", error);
        }
      }
    }
    setRestaurantNames(names);
  };

  useEffect(() => {
    fetchRestaurantNames();
  }, [recommended, currentIndex]);

  const startIndex = currentIndex * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = recommended.slice(startIndex, endIndex);

  return (
    <Container className="my-4">
      {selectedRestaurantId ? (
        <Restaurant restaurantId={selectedRestaurantId} />
      ) : (
        <>
      <Row className="justify-content-center">
        <Col className="text-center">
          <h4>
            <i>Recommended items</i>
          </h4>
        </Col>
      </Row>
      <Row className="align-items-start">
     
        <Col>
            {currentItems.map((item) => (
              <Row key={item.id} className="mb-3">
                <Col>
                  <Card
                    style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }}
                    onClick={() => handleItemSelect(item.restaurant_id)}
                  >
                    <Card.Img
                      variant="left"
                      src={`http://localhost:8000/assets/${item.imageUrl}`}
                      alt={item.name}
                      style={{ width: "150px", height: "auto" }}
                    />
                    <Card.Body>
                      <Card.Title>
                        <strong>{item.name}</strong>&nbsp;({restaurantNames[item.restaurant_id]})
                      </Card.Title>
                      <Card.Text>
                        {item.food_type_name} {item.description}
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
        <Col xs="auto" className="d-flex flex-column align-items-center">
          <Button
            variant="light"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous"
            style={{ marginBottom: "10px" }}
          >
            <FaArrowUp />
          </Button>
          <Button
            variant="light"
            onClick={handleNext}
            disabled={currentIndex === totalPages - 1}
            aria-label="Next"
          >
            <FaArrowDown />
          </Button>
        </Col>
      </Row>
      </>
      )}
    </Container>
  );
};

export default RecommendedItems;
