import React, { useContext } from "react";
import axios from "axios";
import { Table, Button, Container } from "react-bootstrap";
import { UserContext } from '../UserContext';

const AllRestaurantsTable = ({ restaurants, onToggleArchive }) => {
  const { token } = useContext(UserContext);

  const handleToggleArchive = async (id) => {
    try {
      // Log the request for debugging purposes
      console.log(`Toggle-archiving restaurant with ID: ${id}`);
      const response = await axios.put(
        `http://localhost:8000/api/restaurants/${id}/toggle_archive`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        }
      );
      console.log('Response:', response);
      onToggleArchive(id);
    } catch (error) {
      console.error("There was an error archiving the restaurant!", error);
    }
  };

  // Sort the restaurants by ID
  const sortedRestaurants = restaurants.slice().sort((a, b) => a.id - b.id);

  return (
    <Container className="my-4">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Street Name</th>
            <th>City</th>
            <th>Star Rating</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {sortedRestaurants.map((restaurant) => (
            <tr
              key={restaurant.id}
            >
              <td>{restaurant.id}</td>
              <td>{restaurant.name}</td>
              <td>{restaurant.latitude.toFixed(3)}</td>
              <td>{restaurant.longitude.toFixed(3)}</td>
              <td>{restaurant.street_name}</td>
              <td>{restaurant.city}</td>
              <td>{restaurant.star_rating}</td>
              <td>{restaurant.type}</td>
              <td>
                <Button
                  variant={restaurant.is_archived ? "secondary" : "warning"}
                  onClick={() => handleToggleArchive(restaurant.id)}
                >
                  {restaurant.is_archived ? "Unarchive" : "Archive"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AllRestaurantsTable;
