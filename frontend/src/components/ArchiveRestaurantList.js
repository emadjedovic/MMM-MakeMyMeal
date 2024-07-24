// src/components/ArchiveRestaurantList.js

import React from "react";
import axios from "axios";

const ArchiveRestaurantList = ({ restaurants, onRemove }) => {
  const handleArchiveRestaurant = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/restaurants/${id}/archive`);
      alert("Restaurant archived successfully!");
      onRemove(id);
    } catch (error) {
      console.error("There was an error archiving the restaurant!", error);
    }
  };

  return (
    <div>
      <h3>Archive a Restaurant</h3>
      {restaurants.map((restaurant) => (
        <div key={restaurant.id}>
          <span>{restaurant.name}</span>
          <button onClick={() => handleArchiveRestaurant(restaurant.id)}>
            Archive
          </button>
        </div>
      ))}
    </div>
  );
};

export default ArchiveRestaurantList;
