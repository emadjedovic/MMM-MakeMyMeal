import React from "react";

const Restaurant = ({ restaurant }) => {
  return (
    <div>
      <h2>{restaurant.name}</h2>
      <p>Street: {restaurant.street_name}</p>
      <p>Rating: {restaurant.star_rating}</p>
      <p>Type: {restaurant.type}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default Restaurant;
