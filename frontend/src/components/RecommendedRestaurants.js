import React, { useEffect, useState } from "react";
import { Carousel, Container, Card, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Import icons for navigation
import RestaurantCard from "./RestaurantCard";

const RecommendedRestaurants = ({ recommended }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, recommended.length - 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
      <Container className="my-4 mx-4" style={{ maxWidth: "400px", margin: "0 auto" }}>
        <div style={{ textAlign: "center" }}>
        <h2>Recommended</h2>
          <Button 
            variant="light" 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
            aria-label="Previous"
            style={{ marginRight: "10px" }}
          >
            <FaArrowLeft />
          </Button>
          <div 
            style={{ 
              display: "inline-block", 
              width: "auto", 
              maxWidth: "300px",  // Set the max width for the card
              textAlign: "center" 
            }}
          >
            {recommended.length > 0 && (
              <RestaurantCard restaurant={recommended[currentIndex]} />
            )}
          </div>
          <Button 
            variant="light" 
            onClick={handleNext} 
            disabled={currentIndex === recommended.length - 1}
            aria-label="Next"
            style={{ marginLeft: "10px" }}
          >
            <FaArrowRight />
          </Button>
        </div>
      </Container>
    );
};

export default RecommendedRestaurants;
