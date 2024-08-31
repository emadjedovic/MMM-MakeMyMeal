import React, { useState } from "react";
import { Table, Pagination, Row, Col, Form, Button } from "react-bootstrap";
import RestaurantTypesList from "../RestaurantTypesList";
import DeleteRestaurant from "../modals/DeleteRestaurantModal";

const AdminRestaurantsTable = ({
  restaurants,
  onToggleArchive,
  restaurantTypes,
  onTypeSelect,
  selectedType,
  onDelete,
  handleRestaurantSelectParent,
}) => {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [showArchived, setShowArchived] = useState(true);
  const [showNotArchived, setShowNotArchived] = useState(true);

  const indexOfLastRestaurant = currentPage * itemsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - itemsPerPage;

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

  const sortedRestaurants = [...filteredRestaurants].sort(
    (a, b) => a.id - b.id
  );

  const currentRestaurants = sortedRestaurants.slice(
    indexOfFirstRestaurant,
    indexOfLastRestaurant
  );

  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);

  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchCityChange = (e) => {
    setSearchCity(e.target.value);
    setCurrentPage(1);
  };

  return (
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
                onChange={(e) => {
                  setShowArchived(e.target.checked);
                  setCurrentPage(1);
                }}
              />
              <Form.Check
                type="checkbox"
                label="Not Archived"
                checked={showNotArchived}
                onChange={(e) => {
                  setShowNotArchived(e.target.checked);
                  setCurrentPage(1);
                }}
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
                    onClick={() => handleRestaurantSelectParent(restaurant.id)}
                  >
                    {restaurant.name}
                  </Button>
                </td>
                <td>{restaurant.latitude.toFixed(5)}</td>
                <td>{restaurant.longitude.toFixed(5)}</td>
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
  );
};

export default AdminRestaurantsTable;
