import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Tab, Nav, Alert, Modal, Button } from "react-bootstrap";
import { UserContext } from "../UserContext";
import AddRestaurantForm from "../components/forms/AddRestaurantForm";
import UpdateRestaurantForm from "../components/forms/UpdateRestaurantForm";
import AdminRestaurantsTable from "../components/tables/AdminRestaurantsTable";
import CreateRestaurantAdminForm from "../components/forms/CreateRestaurantAdminForm";
import LookupTables from "../components/LookupTables";
import PromotionsTable from "../components/tables/PromotionsTable";
import RestaurantPage from "../components/RestaurantPage";
import OrdersTable from "../components/tables/OrdersTable";
import OrderModal from "../components/modals/OrderModal";
import "../css/App.css";
import {
  handleToggleArchiveRestaurant,
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
  handleFetchOrdersAll,
  handleUpdateRestaurant,
} from "../handlers/AdminPageHandlers";

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
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    handleFetchRestaurantsByType(token, selectedType, setRestaurants);
  }, [selectedType, token]);

  useEffect(() => {
    handleFetchTypes(token, setRestaurantTypes, setFoodTypes);
  }, [token]);

  useEffect(() => {
    handleFetchPromotionData(token, setPromotedItems, setPromotions);
  }, [token]);

  useEffect(() => {
    handleFetchOrdersAll(token, setOrdersAll);
  }, [token]);

  useEffect(() => {
    window.addEventListener("popstate", () => setSelectedRestaurantId(null));
    return () => {
      window.removeEventListener("popstate", () => setSelectedRestaurantId(null));
    };
  }, [selectedRestaurantId]);

  const handleShowOrderModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowOrderModal(true);
  };

  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrderId(null);
  };

  return (
    <Container className="my-4">
      <>
        <Tab.Container defaultActiveKey="restaurants">
          <Nav
            variant="underline"
            className="mb-3"
            onClick={() => {
              setSelectedRestaurantId(null);
            }}
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
                <RestaurantPage restaurantId={selectedRestaurantId} />
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
                      onTypeSelect={(type) => setSelectedType(type)}
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
                        setSelectedRestaurantId(restaurantId)
                      }
                    />
                  </Row>
                  <Row>
                    <Col>
                      <AddRestaurantForm
                        onAdd={(newRestaurant) =>
                          setRestaurants([...restaurants, newRestaurant])
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
                <RestaurantPage restaurantId={selectedRestaurantId} />
              ) : (
                <PromotionsTable
                  items={promotedItems}
                  promotions={promotions}
                  handleRestaurantSelectParent={(restaurantId) =>
                    setSelectedRestaurantId(restaurantId)
                  }
                />
              )}
            </Tab.Pane>

            <Tab.Pane eventKey="orders-table">
              {selectedRestaurantId ? (
                <RestaurantPage restaurantId={selectedRestaurantId} />
              ) : (
                <>
                <Row>
                <Col>
                  <OrdersTable
                    orders={ordersAll}
                    handleOrderSelectParent={(orderId) =>
                      handleShowOrderModal(orderId)
                    }
                    handleRestaurantSelectParent={(restaurantId) =>
                      setSelectedRestaurantId(restaurantId)
                    }
                    refreshOrdersParent={() =>
                      handleFetchOrdersAll(
                        token,
                        setOrdersAll
                      )}
                  />
                </Col>
              </Row>
              {showOrderModal && (
                <Modal show={showOrderModal} onHide={handleCloseOrderModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Order Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <OrderModal
                      orderId={selectedOrderId}
                      showModal={showOrderModal}
                      handleClose={handleCloseOrderModal}
                      
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseOrderModal}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              )}
                </>)}
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
