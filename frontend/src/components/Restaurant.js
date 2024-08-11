import React, { useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import RestaurantCard from "./RestaurantCard";
import ItemsTable from "./ItemsTable";
import {
  handleFoodTypeSelect,
  handleFetchFoodTypes,
  handleFetchItemsByFoodType,
} from "../handlers/restaurantHandlers";

const Restaurant = ({ restaurantId }) => {
  const [items, setItems] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [selectedFoodType, setSelectedFoodType] = useState("All");

  const handleFetchItems = () => {
    handleFetchItemsByFoodType(restaurantId, selectedFoodType, setItems);
  };

  useEffect(() => {
    handleFetchItemsByFoodType(restaurantId, selectedFoodType, setItems);
  }, [selectedFoodType]);

  useEffect(() => {
    handleFetchFoodTypes(setFoodTypes);
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
            refreshItems={handleFetchItems}
          />
        </Col>
        <Col md={2} lg={3}>
          <RestaurantCard restaurantId={restaurantId} handleRestaurantSelectParent={()=>{}}/>
        </Col>
      </Row>
    </Container>
  );
};

export default Restaurant;
