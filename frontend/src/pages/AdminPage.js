import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Tab, Nav, Alert } from "react-bootstrap";
import { UserContext } from "../UserContext";
import AddRestaurantForm from "../components/AddRestaurantForm";
import UpdateRestaurantForm from "../components/UpdateRestaurantForm";
import AdminRestaurantsTable from "../components/AdminRestaurantsTable";
import CreateRestaurantAdminForm from "../components/CreateRestaurantAdminForm";
import LookupTables from "../components/LookupTables";
import PromotionsTable from "../components/PromotionsTable";
import "../css/App.css";
import {
  fetchRestaurantData,
  fetchOtherData,
  handleAdd,
  handleUpdate,
  handleToggleArchive,
  handleTypeSelect,
  handleAdminCreated,
  handleDelete,
  handleAddRestaurantType,
  handleRenameRestaurantType,
  handleDeleteRestaurantType,
  handleAddFoodType,
  handleRenameFoodType,
  handleDeleteFoodType,
} from "../services/adminHandlers"; // Adjusted path

const AdminPage = () => {
  const { token } = useContext(UserContext);
  const [error, setError] = useState("");

  const [restaurants, setRestaurants] = useState([]);
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    fetchRestaurantData(token, selectedType, setRestaurants);
  }, [selectedType, token]);

  const [restaurantTypes, setRestaurantTypes] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [promotedItems, setPromotedItems] = useState([]);
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    fetchOtherData(token, setRestaurantTypes, setFoodTypes, setPromotedItems, setPromotions);
  }, [token]);

  return (
    <Container>
      <Tab.Container defaultActiveKey="restaurants">
        <Nav variant="underline" className="mb-3">

          <Nav.Item>
            <Nav.Link eventKey="restaurants">Restaurants</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link eventKey="manage-users">Users</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="lookup-tables">Lookup Tables</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="promotions-table">Promotions</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          
          <Tab.Pane eventKey="restaurants">
            <Row>
            <AdminRestaurantsTable
              restaurants={restaurants}
              onToggleArchive={(id) =>
                handleToggleArchive(id, token, restaurants, setRestaurants)
              }
              restaurantTypes={restaurantTypes}
              onTypeSelect={(type) => handleTypeSelect(type, setSelectedType)}
              selectedType={selectedType}
              onDelete={(id) =>
                handleDelete(id, token, restaurants, setRestaurants, setError)
              }
            />
            </Row>
            <Row>
              <Col>
                <AddRestaurantForm
                  onAdd={(newRestaurant) =>
                    handleAdd(newRestaurant, restaurants, setRestaurants)
                  }
                />
              </Col>
              <Col>
                <UpdateRestaurantForm
                  onUpdate={(updatedRestaurant) =>
                    handleUpdate(updatedRestaurant, restaurants, setRestaurants)
                  }
                />
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
              onAddRestaurantType={(newTypeName) =>
                handleAddRestaurantType(
                  newTypeName,
                  token,
                  restaurantTypes,
                  setRestaurantTypes
                )
              }
              onRenameRestaurantType={(oldName, newName) =>
                handleRenameRestaurantType(
                  oldName,
                  newName,
                  token,
                  restaurantTypes,
                  setRestaurantTypes
                )
              }
              onDeleteRestaurantType={(typeName) =>
                handleDeleteRestaurantType(
                  typeName,
                  token,
                  restaurantTypes,
                  setRestaurantTypes
                )
              }
              foodTypes={foodTypes}
              onAddFoodType={(newTypeName) =>
                handleAddFoodType(newTypeName, token, foodTypes, setFoodTypes)
              }
              onRenameFoodType={(oldName, newName) =>
                handleRenameFoodType(
                  oldName,
                  newName,
                  token,
                  foodTypes,
                  setFoodTypes
                )
              }
              onDeleteFoodType={(typeName) =>
                handleDeleteFoodType(typeName, token, foodTypes, setFoodTypes)
              }
            />
          </Tab.Pane>

          <Tab.Pane eventKey="promotions-table">
            <PromotionsTable items={promotedItems} promotions={promotions} />
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
