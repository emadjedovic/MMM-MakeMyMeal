import React from "react";
import RestaurantTypeForm from "./forms/RestaurantTypeForm";
import FoodTypeForm from "./forms/FoodTypeForm";
import { Container, Col, Row } from "react-bootstrap";

const LookupTables = ({
  restaurantTypes,
  onAddRestaurantType,
  onRenameRestaurantType,
  onDeleteRestaurantType,

  foodTypes,
  onAddFoodType,
  onRenameFoodType,
  onDeleteFoodType,
}) => {
  return (
    <Container>
      <Row>
        <Col lg={5}>
          <h2>Restaurant Types</h2>
          <Row>
            <Col>
              <RestaurantTypeForm
                action="add"
                onSubmit={onAddRestaurantType}
                restaurantTypes={restaurantTypes}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <RestaurantTypeForm
                action="rename"
                onSubmit={onRenameRestaurantType}
                restaurantTypes={restaurantTypes}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <RestaurantTypeForm
                action="delete"
                onSubmit={onDeleteRestaurantType}
                restaurantTypes={restaurantTypes}
              />
            </Col>
          </Row>
        </Col>

        <Col lg={5}>
          <h2>Food Types</h2>
          <Row>
            <Col>
              <FoodTypeForm
                action="add"
                onSubmit={onAddFoodType}
                foodTypes={foodTypes}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <FoodTypeForm
                action="rename"
                onSubmit={onRenameFoodType}
                foodTypes={foodTypes}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <FoodTypeForm
                action="delete"
                onSubmit={onDeleteFoodType}
                foodTypes={foodTypes}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default LookupTables;
