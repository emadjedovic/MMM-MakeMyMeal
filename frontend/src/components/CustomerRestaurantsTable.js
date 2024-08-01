import React, {useContext} from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Pagination,
} from "react-bootstrap";
import RestaurantTypesList from "./RestaurantTypesList";
import Restaurant from "./Restaurant";
import { UserContext } from "../UserContext";
import { calculateDistance } from '../services/distance.js';
import DEFAULT_IMAGE_URL from "../assets/restaurant-default.png"

const CustomerRestaurantsTable = ({
  nearbyRestaurants,
  restaurantTypes,
  onTypeSelect,
  selectedType,
}) => {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedRestaurant, setSelectedRestaurant] = React.useState(null);
  const { user } = useContext(UserContext);

  const indexOfLastRestaurant = currentPage * itemsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - itemsPerPage;
  const currentRestaurants = nearbyRestaurants.slice(
    indexOfFirstRestaurant,
    indexOfLastRestaurant
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const totalPages = Math.ceil(nearbyRestaurants.length / itemsPerPage);
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
        <Col sm={6} md={4} lg={3} xl={3}>
          <RestaurantTypesList
            restaurantTypes={restaurantTypes}
            selectedType={selectedType}
            handleTypeSelect={onTypeSelect}
          />
        </Col>
        <Col sm={6} md={8} lg={9} xl={9}>
          {selectedRestaurant ? (
            <Restaurant restaurant={selectedRestaurant} />
          ) : (
            <>
              <Row>
                {currentRestaurants.map((restaurant) => (
                  <Col sm={12} md={6} lg={4} xl={3} key={restaurant.id} className="mb-3">
                    <Card onClick={() => handleRestaurantSelect(restaurant)}>
                      
                    <Card.Img
                          variant="top"
                          src={restaurant.imageUrl || DEFAULT_IMAGE_URL}
                          alt={restaurant.name}
                          style={{ height: '150px', objectFit: 'cover' }}
                        />
                      <Card.Body>
                        <Card.Title><strong>{restaurant.name}</strong></Card.Title>
                        <div className="mb-2 text-muted">{restaurant.type}</div>
                        
                        {restaurant.star_rating}/5 {'\u2B50'} <br />
                        <Card.Text>
                          Street: {restaurant.street_name}<br />
                          City: {restaurant.city}<br />
                          {calculateDistance(
                            restaurant.latitude,
                            restaurant.longitude,
                            user.latitude,
                            user.longitude
                          )} km from you<br />
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              <Pagination>{paginationItems}</Pagination>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerRestaurantsTable
