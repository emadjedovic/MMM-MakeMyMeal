import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Tab, Nav, Alert } from "react-bootstrap";
import { UserContext } from "../UserContext";
import AddRestaurantForm from "../components/onlyAdmin/AddRestaurantForm";
import UpdateRestaurantForm from "../components/onlyAdmin/UpdateRestaurantForm";
import AdminRestaurantsTable from "../components/onlyAdmin/AdminRestaurantsTable";
import CreateRestaurantAdminForm from "../components/onlyAdmin/CreateRestaurantAdminForm";
import LookupTables from "../components/onlyAdmin/LookupTables";
import PromotionsTable from "../components/PromotionsTable";
import Restaurant from "../components/Restaurant";
import "../css/App.css";
import {
  handleAdd,
  handleUpdate,
  handleToggleArchive,
  handleTypeSelect,
  handleDelete,
  handleAddRestaurantType,
  handleRenameRestaurantType,
  handleDeleteRestaurantType,
  handleAddFoodType,
  handleRenameFoodType,
  handleDeleteFoodType,
  fetchPromotionData,
  fetchTypes,
  fetchRestaurantsByType,
  handleRestaurantSelectParent,
  handlePopState,
} from "../handlers/adminHandlers";

const AdminPage = () => {
  const { token } = useContext(UserContext);
  const [error, setError] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [restaurantTypes, setRestaurantTypes] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [promotedItems, setPromotedItems] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  useEffect(() => {
    fetchRestaurantsByType(token, selectedType, setRestaurants);
  }, [selectedType, token]);

  useEffect(() => {
    fetchTypes(token, setRestaurantTypes, setFoodTypes);
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchPromotionData(token, setPromotedItems, setPromotions);
    }
  }, [token]);

  useEffect(() => {
    window.addEventListener("popstate", () => handlePopState(setSelectedRestaurantId));

    return () => {
      window.removeEventListener("popstate", () => handlePopState(setSelectedRestaurantId));
    };
  }, []);

  return (
    <Container className="my-4">
      <>
        <Tab.Container defaultActiveKey="restaurants">
          <Nav variant="underline" className="mb-3" onClick={() => handlePopState(setSelectedRestaurantId)}>
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
              {selectedRestaurantId ? (
                <Restaurant restaurantId={selectedRestaurantId} />
              ) : (
                <>
                  <Row>
                    <AdminRestaurantsTable
                      restaurants={restaurants}
                      onToggleArchive={(id) =>
                        handleToggleArchive(
                          id,
                          token,
                          restaurants,
                          setRestaurants
                        )
                      }
                      restaurantTypes={restaurantTypes}
                      onTypeSelect={(type) =>
                        handleTypeSelect(type, setSelectedType)
                      }
                      selectedType={selectedType}
                      onDelete={(id) =>
                        handleDelete(
                          id,
                          token,
                          restaurants,
                          setRestaurants,
                          setError
                        )
                      }
                      handleRestaurantSelectParent={(restaurantId) => handleRestaurantSelectParent(restaurantId, setSelectedRestaurantId)}
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
                          handleUpdate(
                            updatedRestaurant,
                            restaurants,
                            setRestaurants
                          )
                        }
                      />
                    </Col>
                  </Row>
                </>
              )}
            </Tab.Pane>

            <Tab.Pane eventKey="manage-users">
              <Row className="mt-4">
                <Col>
                  <CreateRestaurantAdminForm
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
              {selectedRestaurantId ? (
                <Restaurant restaurantId={selectedRestaurantId} />
              ) : (
                <PromotionsTable
                  items={promotedItems}
                  promotions={promotions}
                  handleRestaurantSelectParent={(restaurantId) => handleRestaurantSelectParent(restaurantId, setSelectedRestaurantId)}
                />
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>

        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
      </>
    </Container>
  );
};

export default AdminPage;
