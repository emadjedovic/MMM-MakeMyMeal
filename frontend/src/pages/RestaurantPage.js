import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Container, Col, Row } from "react-bootstrap";
import RestaurantCard from "../components/RestaurantCard";
import ItemsTable from "../components/ItemsTable";
import {
  handleFoodTypeSelect,
  getRestaurant,
  getItems,
  getFoodTypes,
} from "../services/restaurantHandlers";

const RestaurantPage = () => {
  const { id } = useParams();
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
        <Col md={8} lg={9}>
          <p>
            Listgroup of food types on the left, items grid on the right, add
            item form for restaurant admins
          </p>
          <ItemsTable
            items={items}
            foodTypes={foodTypes}
            onFoodTypeSelect={(type_name) =>
              handleFoodTypeSelect(type_name, setSelectedFoodType)
            }
            selectedFoodType={selectedFoodType}
          />
        </Col>
        <Col>
          <RestaurantCard restaurant={restaurant} />
        </Col>
      </Row>
    </Container>
  );
};

export default RestaurantPage;
