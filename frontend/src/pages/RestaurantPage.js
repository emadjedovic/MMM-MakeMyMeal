import React, { useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import RestaurantCard from "../components/RestaurantCard";
import ItemsTable from "../components/ItemsTable";
import {
  handleFoodTypeSelect,
  getItems,
  getFoodTypes,
} from "../services/restaurantHandlers";

const RestaurantPage = ({restaurantId}) => {
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
        <Col md={9} lg={9}>
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
        <Col md={3} lg={3}>
          <RestaurantCard restaurantId={restaurantId} />
        </Col>
      </Row>
    </Container>
  );
};

export default RestaurantPage;
