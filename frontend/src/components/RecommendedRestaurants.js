import React, { useState } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import RestaurantCard from "./RestaurantCard";

const RecommendedRestaurants = ({
  recommended,
  handleRestaurantSelectParent,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, recommended.length - 1)
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col className="text-center">
          <h4>
            <i>Recommended restaurants</i>
          </h4>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8} lg={8}>
          {recommended.length > 0 && (
            <RestaurantCard
              restaurantId={recommended[currentIndex].id}
              handleRestaurantSelectParent={handleRestaurantSelectParent}
            />
          )}
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
            disabled={currentIndex === recommended.length - 1}
            aria-label="Next"
          >
            <FaArrowRight />
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default RecommendedRestaurants;
