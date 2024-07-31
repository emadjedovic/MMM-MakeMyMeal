import React from 'react';
import { ListGroup } from 'react-bootstrap';

const RestaurantTypesList = ({ restaurantTypes, selectedType, handleTypeSelect }) => {
  return (
    <ListGroup className="me-3">
      <ListGroup.Item
        action
        onClick={() => handleTypeSelect('All Types')}
        active={selectedType === 'All Types'}
      >
        All Types
      </ListGroup.Item>
      {restaurantTypes.map((type) => (
        <ListGroup.Item
          key={type}
          action
          onClick={() => handleTypeSelect(type)}
          active={selectedType === type}
        >
          {type}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default RestaurantTypesList;
