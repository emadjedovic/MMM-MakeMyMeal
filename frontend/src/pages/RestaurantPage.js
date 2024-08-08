import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Container, Col, Row } from "react-bootstrap";
import RestaurantCard from "../components/RestaurantCard";
import ItemsTable from "../components/ItemsTable";
import { UserContext } from "../UserContext";
import {
  handleFoodTypeSelect,
  getRestaurant,
  getItems,
  getFoodTypes,
} from "../services/restaurantHandlers";

const RestaurantPage = () => {
  const { id } = useParams();
  
  const { token, user } = useContext(UserContext);
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [items, setItems] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [selectedFoodType, setSelectedFoodType] = useState("All");

  useEffect(() => {
    getRestaurant(id, setRestaurant);
  }, [id]);

  useEffect(() => {
    if (restaurant) {
      getItems(restaurant.id, selectedFoodType, setItems);
    }
  }, [restaurant, selectedFoodType]);

  useEffect(() => {
    getFoodTypes(setFoodTypes);
  }, []);

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
        <Col md={9} lg={9}>
          <ItemsTable
            items={items}
            foodTypes={foodTypes}
            onFoodTypeSelect={(type_name) =>
              handleFoodTypeSelect(type_name, setSelectedFoodType)
            }
            selectedFoodType={selectedFoodType}
            restaurantID={id}
          />
        </Col>
        <Col md={3} lg={3}>
          <RestaurantCard restaurant={restaurant} />
        </Col>
      </Row>
    </Container>
  );
};

export default RestaurantPage;
