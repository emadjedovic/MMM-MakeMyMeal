import React from "react";
import {
  Table,
  Button,
  Container,
  Pagination,
  Row,
  Col,
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
  const [currentPage, setCurrentPage] = React.useState(1);
  const navigate = useNavigate();

  const indexOfLastRestaurant = currentPage * itemsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - itemsPerPage;
  const currentRestaurants = restaurants.slice(
    indexOfFirstRestaurant,
    indexOfLastRestaurant
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRestaurantSelect = (restaurantId) => {
    console.log("handleRestaurantSelect");
    navigate(`/restaurant/${restaurantId}`);
  };

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
      <Row>
        <Col md={3} lg={3} xl={2}>
          <RestaurantTypesList
            restaurantTypes={restaurantTypes}
            selectedType={selectedType}
            handleTypeSelect={onTypeSelect}
          />
        </Col>
        <Col md={9} lg={9} xl={10}>
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
