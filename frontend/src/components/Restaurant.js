import React, { useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import RestaurantCard from "./RestaurantCard";
import ItemsTable from "./ItemsTable";
import {
  handleFoodTypeSelect,
  getItems,
  getFoodTypes,
} from "../services/restaurantHandlers";

const Restaurant = ({restaurantId}) => {
  const [items, setItems] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [selectedFoodType, setSelectedFoodType] = useState("All");


  useEffect(() => {
      getItems(restaurantId, selectedFoodType, setItems);
  }, [selectedFoodType]);

  useEffect(() => {
    getFoodTypes(setFoodTypes);
  }, []);

  if (!restaurantId) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Row>
        <Col md={10} lg={9}>
          <ItemsTable
            items={items}
            foodTypes={foodTypes}
            onFoodTypeSelect={(type_name) =>
              handleFoodTypeSelect(type_name, setSelectedFoodType)
            }
            selectedFoodType={selectedFoodType}
            restaurantId={restaurantId}
          />
        </Col>
        <Col md={2} lg={3}>
          <RestaurantCard restaurantId={restaurantId} />
        </Col>
      </Row>
    </Container>
  );
};

export default Restaurant;
