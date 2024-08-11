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
import OrdersTable from "../components/OrdersTable";
import Order from "../components/Order";
import "../css/App.css";
import {
  handleAddRestaurant,
  handleUpdateRestaurant,
  handleToggleArchiveRestaurant,
  handleTypeSelect,
  handleDeleteRestaurant,
  handleAddRestaurantType,
  handleRenameRestaurantType,
  handleDeleteRestaurantType,
  handleAddFoodType,
  handleRenameFoodType,
  handleDeleteFoodType,
  handleFetchPromotionData,
  handleFetchTypes,
  handleFetchRestaurantsByType,
  handleRestaurantSelectParent,
  handlePopState
} from "../handlers/adminHandlers";
import {
  handleOrderSelectParent,
  handleFetchOrdersAll
} from "../handlers/orderHandlers"

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
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [ordersAll, setOrdersAll] = useState([]);

  useEffect(() => {
    handleFetchRestaurantsByType(token, selectedType, setRestaurants);
  }, [selectedType, token]);

  useEffect(() => {
    handleFetchTypes(token, setRestaurantTypes, setFoodTypes);
  }, [token]);

  useEffect(() => {
    if (token) {
      handleFetchPromotionData(token, setPromotedItems, setPromotions);
    }
  }, [token]);

  useEffect(() => {
    handleFetchOrdersAll(token, setOrdersAll);
  }, [token]);

  useEffect(() => {
    window.addEventListener("popstate", () =>
      handlePopState(setSelectedRestaurantId)
    );
    return () => {
      window.removeEventListener("popstate", () =>
        handlePopState(setSelectedRestaurantId)
      );
    };
  }, []);

  return (
    <Container className="my-4">
      <>
        <Tab.Container defaultActiveKey="restaurants">
          <Nav
            variant="underline"
            className="mb-3"
            onClick={() => handlePopState(setSelectedRestaurantId)}
          >
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
            <Nav.Item>
              <Nav.Link eventKey="orders-table">Orders</Nav.Link>
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
                        handleToggleArchiveRestaurant(
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
                        handleDeleteRestaurant(
                          id,
                          token,
                          restaurants,
                          setRestaurants,
                          setError
                        )
                      }
                      handleRestaurantSelectParent={(restaurantId) =>
                        handleRestaurantSelectParent(
                          restaurantId,
                          setSelectedRestaurantId
                        )
                      }
                    />
                  </Row>
                  <Row>
                    <Col>
                      <AddRestaurantForm
                        onAdd={(newRestaurant) =>
                          handleAddRestaurant(newRestaurant, restaurants, setRestaurants)
                        }
                      />
                    </Col>
                    <Col>
                      <UpdateRestaurantForm
                        onUpdate={(updatedRestaurant) =>
                          handleUpdateRestaurant(
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
                  <CreateRestaurantAdminForm />
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
                  handleRestaurantSelectParent={(restaurantId) =>
                    handleRestaurantSelectParent(
                      restaurantId,
                      setSelectedRestaurantId
                    )
                  }
                />
              )}
            </Tab.Pane>

            <Tab.Pane eventKey="orders-table">
              {selectedRestaurantId ? (
                <Restaurant restaurantId={selectedRestaurantId} />
              ) : selectedOrderId ? (
                <Order orderId={selectedOrderId} />
              ) : (
                <OrdersTable
                  orders={ordersAll}
                  handleOrderSelectParent={(orderId) =>
                    handleOrderSelectParent(orderId, setSelectedOrderId)
                  }
                  handleRestaurantSelectParent={(restaurantId) =>
                    handleRestaurantSelectParent(
                      restaurantId,
                      setSelectedRestaurantId
                    )
                  }
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
