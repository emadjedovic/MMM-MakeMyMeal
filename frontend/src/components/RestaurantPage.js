import React, { useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import RestaurantCard from "./RestaurantCard";
import ItemsTable from "./tables/ItemsTable";
import {
  handleFetchItemsByFoodType,
  handleFetchFoodTypes,
} from "../handlers/RestaurantPageHandlers";

const RestaurantPage = ({ restaurantId }) => {
  const [items, setItems] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [selectedFoodType, setSelectedFoodType] = useState("All");

  useEffect(() => {
    handleFetchItemsByFoodType(setItems, restaurantId, selectedFoodType);
  }, [selectedFoodType, restaurantId]);

  useEffect(() => {
    handleFetchFoodTypes(setFoodTypes);
  }, []);

  if (!restaurantId) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Row>
        <Col md={10} lg={9} className="p-0">
          <ItemsTable
            items={items}
            foodTypes={foodTypes}
            onFoodTypeSelect={(type_name) => setSelectedFoodType(type_name)}
            selectedFoodType={selectedFoodType}
            restaurantId={restaurantId}
            refreshItems={() =>
              handleFetchItemsByFoodType(
                setItems,
                restaurantId,
                selectedFoodType
              )
            }
          />
        </Col>
        <Col md={2} lg={3} className="p-0">
          <RestaurantCard
            restaurantId={restaurantId}
            handleRestaurantSelectParent={() => {}}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default RestaurantPage;
