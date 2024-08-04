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
  fetchData,
  fetchTypes,
  handleAdd,
  handleUpdate,
  handleToggleArchive,
  handleTypeSelect,
  handleAdminCreated,
  handleDelete,
  handleAddRestaurantType,
  handleRenameRestaurantType,
  handleDeleteRestaurantType
} from "../services/adminHandlers";  // Adjusted path

const AdminPage = () => {
  const { token } = useContext(UserContext);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantTypes, setRestaurantTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData(selectedType, token, setRestaurants);
  }, [selectedType, token]);

  useEffect(() => {
    fetchTypes(token, setRestaurantTypes);
  }, [token]);

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
              onToggleArchive={(id) => handleToggleArchive(id, token, restaurants, setRestaurants)}
              restaurantTypes={restaurantTypes}
              onTypeSelect={(type) => handleTypeSelect(type, setSelectedType)}
              selectedType={selectedType}
              onDelete={(id) => handleDelete(id, token, restaurants, setRestaurants, setError)}
            />
          </Tab.Pane>

          <Tab.Pane eventKey="manage-restaurants">
            <Row>
              <Col>
                <AddRestaurantForm onAdd={(newRestaurant) => handleAdd(newRestaurant, restaurants, setRestaurants)} />
              </Col>
              <Col>
                <UpdateRestaurantForm onUpdate={(updatedRestaurant) => handleUpdate(updatedRestaurant, restaurants, setRestaurants)} />
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
              onAddType={(newTypeName) => handleAddRestaurantType(newTypeName, token, restaurantTypes, setRestaurantTypes)}
              onRenameType={(oldName, newName) => handleRenameRestaurantType(oldName, newName, token, restaurantTypes, setRestaurantTypes)}
              onDeleteType={(typeName) => handleDeleteRestaurantType(typeName, token, restaurantTypes, setRestaurantTypes)}
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
