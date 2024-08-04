import React, { useState } from "react";
import {
  Table,
  Button,
  Container,
  Pagination,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import RestaurantTypesList from "./RestaurantTypesList";
import DeleteRestaurant from "./DeleteRestaurant";

const AdminRestaurantsTable = ({
  restaurants,
  onToggleArchive,
  restaurantTypes,
  onTypeSelect,
  selectedType,
  onDelete,
}) => {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [showNotArchived, setShowNotArchived] = useState(true);
  const navigate = useNavigate();

  const indexOfLastRestaurant = currentPage * itemsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - itemsPerPage;

  // Filter restaurants based on search queries and archived status
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesName = restaurant.name
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesCity = restaurant.city
      .toLowerCase()
      .includes(searchCity.toLowerCase());
    const matchesArchivedStatus =
      (showArchived && restaurant.is_archived) ||
      (showNotArchived && !restaurant.is_archived);

    return matchesName && matchesCity && matchesArchivedStatus;
  });

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

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
    setCurrentPage(1); // Reset to the first page when search query changes
  };

  const handleSearchCityChange = (e) => {
    setSearchCity(e.target.value);
    setCurrentPage(1); // Reset to the first page when search query changes
  };

  const handleArchivedChange = (e) => {
    setShowArchived(e.target.checked);
  };

  const handleNotArchivedChange = (e) => {
    setShowNotArchived(e.target.checked);
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
        <Col md={3} lg={3} xl={2}>
          <RestaurantTypesList
            restaurantTypes={restaurantTypes}
            selectedType={selectedType}
            handleTypeSelect={onTypeSelect}
          />
        </Col>
        <Col md={9} lg={9} xl={10}>
          <Row className="mb-3">
            <Col md={6} lg={5}>
              <Form.Control
                type="text"
                placeholder="Search by restaurant name"
                value={searchName}
                onChange={handleSearchNameChange}
              />
            </Col>
            <Col md={4} lg={4}>
              <Form.Control
                type="text"
                placeholder="Search by city"
                value={searchCity}
                onChange={handleSearchCityChange}
              />
            </Col>
            <Col md={2} lg={3}>
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Archived"
                  checked={showArchived}
                  onChange={handleArchivedChange}
                />
                <Form.Check
                  type="checkbox"
                  label="Not Archived"
                  checked={showNotArchived}
                  onChange={handleNotArchivedChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Street</th>
                <th>City</th>
                <th>Rating</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRestaurants.map((restaurant) => (
                <tr key={restaurant.id}>
                  <td>{restaurant.id}</td>
                  <td>
                    <Button
                      variant="link"
                      onClick={() => handleRestaurantSelect(restaurant.id)}
                    >
                      {restaurant.name}
                    </Button>
                  </td>
                  <td>{restaurant.latitude.toFixed(3)}</td>
                  <td>{restaurant.longitude.toFixed(3)}</td>
                  <td>{restaurant.street_name}</td>
                  <td>{restaurant.city}</td>
                  <td>{restaurant.star_rating}</td>
                  <td>{restaurant.type_name}</td>
                  <td>
                    <Button
                      variant={restaurant.is_archived ? "secondary" : "warning"}
                      onClick={() => onToggleArchive(restaurant.id)}
                      style={{ margin: "0.3rem" }}
                    >
                      {restaurant.is_archived ? "Unarchive" : "Archive"}
                    </Button>
                    <DeleteRestaurant
                      restaurantId={restaurant.id}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>{paginationItems}</Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminRestaurantsTable;
