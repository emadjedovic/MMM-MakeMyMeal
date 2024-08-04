import React, { useContext, useState } from "react";
import { Container, Row, Col, Card, Pagination, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import RestaurantTypesList from "./RestaurantTypesList";
import { UserContext } from "../UserContext";
import { calculateDistance } from "../services/distance.js";
import "../css/App.css";

const CustomerRestaurantsTable = ({
  nearbyRestaurants,
  restaurantTypes,
  onTypeSelect,
  selectedType,
}) => {

  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

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

  const handleRestaurantSelect = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
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
        <Col md={4} lg={3} xl={2} xxl={2}>
          <RestaurantTypesList
            restaurantTypes={restaurantTypes}
            selectedType={selectedType}
            handleTypeSelect={onTypeSelect}
          />
        </Col>
        <Col md={8} lg={9} xl={10} xxl={10}>
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
                <Card
                  onClick={() => handleRestaurantSelect(restaurant.id)}
                  className="hover-card"
                >
                  <Card.Img
                    variant="top"
                    src={`http://localhost:8000/images/${restaurant.imageUrl}`}
                    alt={restaurant.name}
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>
                      <strong>{restaurant.name}</strong>
                    </Card.Title>
                    <div className="mb-1 text-muted">
                      {restaurantTypes.find(
                        (type) => type.name === restaurant.type_name
                      )?.name || "Other"}
                      &nbsp;{"\u2B50 "}
                      {restaurant.star_rating}/5
                    </div>
                    <Card.Text></Card.Text>
                    <Card.Text style={{ margin: "5px 0" }}>
                      <i>
                        {restaurant.street_name} ({restaurant.city})
                      </i>
                    </Card.Text>
                    <Card.Text style={{ fontSize: "0.875em" }}>
                      {calculateDistance(
                        restaurant.latitude,
                        restaurant.longitude,
                        user.latitude,
                        user.longitude
                      )}{" "}
                      km from you
                    </Card.Text>
                  </Card.Body>
                </Card>
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
