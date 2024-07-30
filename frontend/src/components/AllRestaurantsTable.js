import React, { useContext, useState } from "react";
import axios from "axios";
import { Table, Button, Container, Pagination } from "react-bootstrap";
import { UserContext } from '../UserContext';

const AllRestaurantsTable = ({ restaurants, onToggleArchive }) => {
  const { token } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleToggleArchive = async (id) => {
    try {
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

  // Calculate the index range for the current page
  const indexOfLastRestaurant = currentPage * itemsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - itemsPerPage;
  const currentRestaurants = restaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination Controls
  const totalPages = Math.ceil(restaurants.length / itemsPerPage);
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item 
        key={number} 
        active={number === currentPage} 
        onClick={() => handlePageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }


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
        {currentRestaurants.map((restaurant) => (
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
      <Pagination>
        {paginationItems}
      </Pagination>
    </Container>
  );
};

export default AllRestaurantsTable;
