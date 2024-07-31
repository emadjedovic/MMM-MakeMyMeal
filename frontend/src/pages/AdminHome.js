import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import axios from "axios";
import { UserContext } from "../UserContext";
import AddRestaurantForm from "../components/AddRestaurantForm";
import UpdateRestaurantForm from "../components/UpdateRestaurantForm";
import AdminRestaurantsTable from "../components/AdminRestaurantsTable";
import CreateRestaurantAdminForm from "../components/CreateRestaurantAdminForm";
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
            'Content-Type': 'application/json',
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

  const handleAdminCreated = (rest_admin) => {
    console.log("New restaurant admin created:", rest_admin);
  };

  return (
    <Container>
      <Tab.Container defaultActiveKey="home">
        <Nav variant="underline" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="home">Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="manage-restaurants">Manage Restaurants</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="manage-users">Manage Users</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="home">
            <AdminRestaurantsTable
              restaurants={restaurants}
              onToggleArchive={handleToggleArchive}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="manage-restaurants">
            <Row>
              <Col>
                <AddRestaurantForm onAdd={handleAdd} />
              </Col>
              <Col>
                <UpdateRestaurantForm onUpdate={handleUpdate} />
              </Col>
            </Row>
          </Tab.Pane>
          <Tab.Pane eventKey="manage-users">
            <Row className="mt-4">
              <Col>
                <CreateRestaurantAdminForm onAdminCreated={handleAdminCreated} />
              </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default AdminHome;