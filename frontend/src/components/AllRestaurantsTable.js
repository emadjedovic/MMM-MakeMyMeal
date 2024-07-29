import React from "react";
import axios from "axios";

const AllRestaurantsTable = ({ restaurants, onArchive }) => {
  const handleArchive = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/restaurants/${id}/archive`);
      onArchive(id);
    } catch (error) {
      console.error("There was an error archiving the restaurant!", error);
    }
  };


  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Latitude</th>
          <th>Longitude</th>
          <th>Street Name</th>
          <th>City</th>
          <th>Star Rating</th>
          <th>Type</th>
          <th>Radius of Delivery (km)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {restaurants.map((restaurant) => (
          <tr
            key={restaurant.id}
            style={{
              backgroundColor: restaurant.isArchived ? "#d3d3d3" : "transparent",
            }}
          >
            <td>{restaurant.name}</td>
            <td>{restaurant.latitude}</td>
            <td>{restaurant.longitude}</td>
            <td>{restaurant.street_name}</td>
            <td>{restaurant.city}</td>
            <td>{restaurant.star_rating}</td>
            <td>{restaurant.type}</td>
            <td>{restaurant.radius_of_delivery_km}</td>
            <td>
              {!restaurant.isArchived && (
                <button onClick={() => handleArchive(restaurant.id)}>Archive</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AllRestaurantsTable;
