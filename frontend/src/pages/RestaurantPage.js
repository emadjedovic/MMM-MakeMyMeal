import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Container, Col, Row } from "react-bootstrap";
import RestaurantCard from "../components/RestaurantCard";
import { fetchRestaurantById } from "../services/api";

const RestaurantPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const getRestaurant = async () => {
      console.log("sending id: ", id);
      const data = await fetchRestaurantById(id);
      console.log("fetched data: ", data);
      setRestaurant(data);
    };
    getRestaurant();
  }, [id]);

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <Container>
      <Button onClick={handleBackClick} variant="outline-dark" className="mb-3">
        Back to Home
      </Button>
      <Row>
        <Col md={8} lg={9}>
          <p>Foodtypes, menu, etc.</p>
        </Col>
        <Col>
          <RestaurantCard restaurant={restaurant} />
        </Col>
      </Row>
    </Container>
  );
};

export default RestaurantPage;
