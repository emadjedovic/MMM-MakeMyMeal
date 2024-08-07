import React, { useContext, useState } from "react";
import { Container, Row, Col, Card, Pagination, Form } from "react-bootstrap";
import RestaurantTypesList from "./RestaurantTypesList";
import "../css/App.css";
import RestaurantCard from "./RestaurantCard.js";

const CustomerRestaurantsTable = ({
  nearbyRestaurants,
  restaurantTypes,
  onTypeSelect,
  selectedType,
}) => {

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const indexOfLastRestaurant = currentPage * itemsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - itemsPerPage;

  // Filter restaurants by name based on the search query
  const filteredRestaurants = nearbyRestaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentRestaurants = filteredRestaurants.slice(
    indexOfFirstRestaurant,
    indexOfLastRestaurant
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when search query changes
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

  return (
    <Container className="my-4">
      
      <Row>
        <Col md={4} lg={3} xl={3} xxl={2}>
          <RestaurantTypesList
            restaurantTypes={restaurantTypes}
            selectedType={selectedType}
            handleTypeSelect={onTypeSelect}
          />
        </Col>
        <Col md={8} lg={9} xl={9} xxl={10}>
        <Form.Control
            type="text"
            placeholder="Search by restaurant name"
            value={searchQuery}
            onChange={handleSearchChange}
            className="mb-3"
          />
          <Row>
            {currentRestaurants.map((restaurant) => (
              <Col
                md={12}
                lg={6}
                xl={4}
                xxl={3}
                key={restaurant.id}
                className="mb-3"
              >
                <RestaurantCard restaurant={restaurant}/>
              </Col>
            ))}
          </Row>
          <Pagination>{paginationItems}</Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerRestaurantsTable;
