import React, { useState } from "react";
import { Container, Row, Col, Pagination, Form } from "react-bootstrap";
import RestaurantTypesList from "../RestaurantTypesList.js";
import RestaurantCard from "../RestaurantCard.js";

const CustomerRestaurantsTable = ({
  nearbyRestaurants,
  restaurantTypes,
  onTypeSelect,
  selectedType,
  handleRestaurantSelectParent,
}) => {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const indexOfLastRestaurant = currentPage * itemsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - itemsPerPage;

  const filteredRestaurants = nearbyRestaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentRestaurants = filteredRestaurants.slice(
    indexOfFirstRestaurant,
    indexOfLastRestaurant
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={(pageNumber) => setCurrentPage(pageNumber)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <Container className="my-4">
      <Row>
        <Col md={4} lg={3} xl={2}>
          <RestaurantTypesList
            restaurantTypes={restaurantTypes}
            selectedType={selectedType}
            handleTypeSelect={onTypeSelect}
          />
        </Col>
        <Col md={8} lg={9} xl={10}>
          <Form.Control
            type="text"
            placeholder="Search by restaurant name"
            value={searchQuery}
            onChange={handleSearchChange}
            className="mb-4"
          />
          <Row>
            {currentRestaurants.map((restaurant) => (
              <Col
                md={12}
                lg={6}
                xl={4}
                xxl={4}
                key={restaurant.id}
                className="mb-1"
              >
                <RestaurantCard
                  restaurantId={restaurant.id}
                  handleRestaurantSelectParent={handleRestaurantSelectParent}
                />
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
