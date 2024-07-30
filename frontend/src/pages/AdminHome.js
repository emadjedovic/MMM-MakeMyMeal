import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { UserContext } from "../UserContext";
import AddRestaurantForm from "../components/AddRestaurantForm";
import UpdateRestaurantForm from "../components/UpdateRestaurantForm";
import AllRestaurantsTable from "../components/AllRestaurantsTable";
import "../css/App.css";

const AdminHome = () => {
  const { token } = useContext(UserContext);
  const [restaurants, setRestaurants] = useState([]);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/restaurants/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRestaurants(response.data);
    } catch (error) {
      console.error("There was an error fetching the restaurants!", error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleAdd = (newRestaurant) => {
    setRestaurants([...restaurants, newRestaurant]);
  };

  const handleUpdate = (updatedRestaurant) => {
    setRestaurants(
      restaurants.map((restaurant) =>
        restaurant.id === updatedRestaurant.id ? updatedRestaurant : restaurant
      )
    );
  };

  const handleToggleArchive = (id) => {
    setRestaurants(
      restaurants.map((restaurant) =>
        restaurant.id === id
          ? { ...restaurant, is_archived: !restaurant.is_archived }
          : restaurant
      )
    );
  };

  return (
    <Container>
      <h1>ADMIN DASHBOARD</h1>
      <AllRestaurantsTable
        restaurants={restaurants}
        onToggleArchive={handleToggleArchive}
      />
      <Row>
        <Col>
          <AddRestaurantForm onAdd={handleAdd} />
        </Col>
        <Col>
          <UpdateRestaurantForm onUpdate={handleUpdate} />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminHome;
