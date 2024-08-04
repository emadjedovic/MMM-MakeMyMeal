import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Tab, Nav, Alert } from "react-bootstrap";
import { UserContext } from "../UserContext";
import AddRestaurantForm from "../components/AddRestaurantForm";
import UpdateRestaurantForm from "../components/UpdateRestaurantForm";
import AdminRestaurantsTable from "../components/AdminRestaurantsTable";
import CreateRestaurantAdminForm from "../components/CreateRestaurantAdminForm";
import LookupTables from "../components/LookupTables";
import "../css/App.css";
import {
  fetchRestaurants,
  fetchRestaurantTypes,
  toggleArchiveRestaurant,
  deleteRestaurant,
  addRestaurantType,
  renameRestaurantType,
  deleteRestaurantType
} from "../services/api";

const AdminPage = () => {
  const { token } = useContext(UserContext);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantTypes, setRestaurantTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedRestaurants = await fetchRestaurants(selectedType, token);
        setRestaurants(fetchedRestaurants);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchData();
  }, [selectedType, token]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await fetchRestaurantTypes(token);
        setRestaurantTypes(types);
      } catch (error) {
        console.error("Error fetching restaurant types:", error);
      }
    };

    fetchTypes();
  }, [token]);

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

  const handleToggleArchive = async (id) => {
    try {
      await toggleArchiveRestaurant(id, token);
      setRestaurants(
        restaurants.map((restaurant) =>
          restaurant.id === id
            ? { ...restaurant, is_archived: !restaurant.is_archived }
            : restaurant
        )
      );
    } catch (error) {
      console.error("Error archiving restaurant:", error);
    }
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleAdminCreated = (rest_admin) => {
    console.log("New restaurant admin created:", rest_admin);
  };

  const handleDelete = async (id) => {
    setError("");

    try {
      await deleteRestaurant(id, token);
      setRestaurants(restaurants.filter((restaurant) => restaurant.id !== id));
    } catch (err) {
      setError("There was an error deleting the restaurant.");
      console.error("Error deleting the restaurant:", err);
    }
  };

  const handleAddType = async (newTypeName) => {
    try {
      const addedType = await addRestaurantType(newTypeName, token);
      console.log("addedType: ", newTypeName)
      setRestaurantTypes([...restaurantTypes, addedType]);
    } catch (error) {
      console.error("Error adding restaurant type:", error);
    }
  };

  const handleRenameType = async (oldName, newName) => {
    try {
      const renamedType = await renameRestaurantType(oldName, newName, token);
      console.log(`Renamed ${oldName} to ${newName}.`);
      setRestaurantTypes(
        restaurantTypes.map((type) =>
          type.name === oldName ? renamedType : type
        )
      );
    } catch (error) {
      console.error("Error renaming restaurant type:", error);
    }
  };

  const handleDeleteType = async (typeName) => {
    try {
      await deleteRestaurantType(typeName, token);
      console.log("deletedType: ", typeName)
      setRestaurantTypes(
        restaurantTypes.filter((type) => type.name !== typeName)
      );
    } catch (error) {
      console.error("Error deleting restaurant type:", error);
    }
  };

  return (
    <Container>
      <Tab.Container defaultActiveKey="restaurants">
        <Nav variant="underline" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="restaurants">All Restaurants</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="manage-restaurants">
              Manage Restaurants
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="manage-users">Manage Users</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="lookup-tables">Lookup Tables</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>

          <Tab.Pane eventKey="restaurants">
            <AdminRestaurantsTable
              restaurants={restaurants}
              onToggleArchive={handleToggleArchive}
              restaurantTypes={restaurantTypes}
              onTypeSelect={handleTypeSelect}
              selectedType={selectedType}
              onDelete={handleDelete}
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
                <CreateRestaurantAdminForm
                  onAdminCreated={handleAdminCreated}
                />
              </Col>
            </Row>
          </Tab.Pane>

          <Tab.Pane eventKey="lookup-tables">
            <LookupTables
              restaurantTypes={restaurantTypes}
              onAddType={handleAddType}
              onRenameType={handleRenameType}
              onDeleteType={handleDeleteType}
            />
          </Tab.Pane>

        </Tab.Content>
      </Tab.Container>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default AdminPage;
