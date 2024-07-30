import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Container, Pagination, ListGroup } from "react-bootstrap";
import { UserContext } from '../UserContext';
import DeleteRestaurant from "./DeleteRestaurant";

const AllRestaurantsTable = ({ restaurants, onToggleArchive }) => {
  const { token } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);
  const [restaurantTypes, setRestaurantTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('All Types');

  useEffect(() => {
    const fetchRestaurantTypes = async () => {
      try {
        // Adjust the endpoint as needed to fetch restaurant types
        const response = await axios.get('http://localhost:8000/api/restaurants/types',
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRestaurantTypes(response.data);
      } catch (error) {
        console.error('Error fetching restaurant types:', error);
      }
    };

    fetchRestaurantTypes();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const url = selectedType === 'All Types'
        ? 'http://localhost:8000/api/restaurants/all'
        : `http://localhost:8000/api/restaurants/types/${selectedType}`;
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
      setFilteredRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [selectedType, token]);

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

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  // Pagination Controls
  const indexOfLastRestaurant = currentPage * itemsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - itemsPerPage;
  const currentRestaurants = filteredRestaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
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

  const handleDelete = () => {
    fetchRestaurants();
  };

  return (
    <Container className="my-4">
      <div className="d-flex">
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
        <div className="flex-grow-1">
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
                <tr key={restaurant.id}>
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
        </div>
      </div>
      <div className="mt-4">
      <DeleteRestaurant onDelete={handleDelete} />
      </div>
    </Container>
  );
};

export default AllRestaurantsTable;