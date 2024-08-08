import React from "react";
import { ListGroup } from "react-bootstrap";

const RestaurantTypesList = ({
  restaurantTypes,
  selectedType,
  handleTypeSelect,
}) => {
  return (
    <ListGroup className="me-1">
      <ListGroup.Item
        action
        onClick={() => handleTypeSelect("All")}
        active={selectedType === "All"}
      >
        ALL
      </ListGroup.Item>
      {restaurantTypes.map((type) => (
        <ListGroup.Item
          key={type.id}
          action
          onClick={() => handleTypeSelect(type.name)}
          active={selectedType === type.name}
        >
          {type.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default RestaurantTypesList;
