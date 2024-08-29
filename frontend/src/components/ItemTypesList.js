import React from "react";
import { ListGroup } from "react-bootstrap";

const ItemTypesList = ({
  foodTypes,
  selectedFoodType,
  handleFoodTypeSelect,
}) => {
  if (!foodTypes.length) {
    return <div>No Food Types Available</div>;
  }

  return (
    <ListGroup>
      <ListGroup.Item
        action
        onClick={() => handleFoodTypeSelect("All")}
        active={selectedFoodType === "All"}
      >
        ALL
      </ListGroup.Item>
      {foodTypes.map((type) => (
        <ListGroup.Item
          key={type.id}
          action
          onClick={() => handleFoodTypeSelect(type.name)}
          active={selectedFoodType === type.name}
        >
          {type.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default ItemTypesList;
