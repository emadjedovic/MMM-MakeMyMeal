// src/components/LookupTables.js
import React from "react";
import RestaurantTypeForm from "./RestaurantTypeForm";
import { Container, Col, Row } from "react-bootstrap";

const LookupTables = ({
  restaurantTypes,
  onAddRestaurantType,
  onRenameRestaurantType,
  onDeleteRestaurantType,
}) => {
  return (
    <Container>
      <Row>
        <Col lg={5}>
          <h2>RESTAURANT TYPES</h2>
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
          <h2>FOOD TYPES</h2>
          {/* Add content for FOOD TYPES here */}
        </Col>
      </Row>
    </Container>
  );
};

export default LookupTables;
