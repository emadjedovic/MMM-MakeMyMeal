import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { Container, Tab, Nav, Row, Col } from "react-bootstrap";
import CustomerRestaurantsTable from "../components/tables/CustomerRestaurantsTable";
import RecommendedRestaurants from "../components/RecommendedRestaurants";
import PromotionsTable from "../components/tables/PromotionsTable";
import RecommendedItems from "../components/RecommendedItems";
import RestaurantPage from "../components/RestaurantPage";
import OrdersTable from "../components/tables/OrdersTable";
import {
  handleFetchPromotionData,
  handleFetchRecommended,
  handleFetchRestaurantTypes,
  handleFetchNearbyRestaurants,
  handleFetchOrdersHistory,
} from "../handlers/CustomerPageHandlers";

const CustomerPage = () => {
  const { token, user } = useContext(UserContext);
  const userId = user.id;
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [restaurantTypes, setRestaurantTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [promotedItems, setPromotedItems] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [ordersCustomerHistory, setOrdersCustomerHistory] = useState([]);

  useEffect(() => {
    handleFetchOrdersHistory(token, userId, setOrdersCustomerHistory);
  }, [token, userId]);

  useEffect(() => {
    if (token) {
      handleFetchNearbyRestaurants(token, selectedType, setNearbyRestaurants);
    }
  }, [selectedType, token]);

  useEffect(() => {
    if (token) {
      handleFetchRecommended(
        token,
        setRecommendedRestaurants,
        setRecommendedItems
      );
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      handleFetchRestaurantTypes(token, setRestaurantTypes);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      handleFetchPromotionData(token, setPromotedItems, setPromotions);
    }
  }, [token]);

  useEffect(() => {
    window.addEventListener("popstate", () => setSelectedRestaurantId(null));

    return () => {
      window.removeEventListener("popstate", () =>
        setSelectedRestaurantId(null)
      );
    };
  }, []);

  return (
    <Container>
      <Tab.Container defaultActiveKey="nearby-restaurants">
        <Nav variant="underline" className="mb-3">
          <Nav.Item onClick={() => setSelectedRestaurantId(null)}>
            <Nav.Link eventKey="nearby-restaurants">Restaurants</Nav.Link>
          </Nav.Item>
          <Nav.Item onClick={() => setSelectedRestaurantId(null)}>
            <Nav.Link eventKey="promotions-table">Promotions</Nav.Link>
          </Nav.Item>
          <Nav.Item onClick={() => setSelectedRestaurantId(null)}>
            <Nav.Link eventKey="orders-table">Order History</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="nearby-restaurants">
            {selectedRestaurantId ? (
              <RestaurantPage restaurantId={selectedRestaurantId} />
            ) : (
              <>
                <CustomerRestaurantsTable
                  nearbyRestaurants={nearbyRestaurants}
                  restaurantTypes={restaurantTypes}
                  onTypeSelect={(type) => setSelectedType(type)}
                  selectedType={selectedType}
                  handleRestaurantSelectParent={(restaurantId) =>
                    setSelectedRestaurantId(restaurantId)
                  }
                />
                <Row className="text-center mt-5">
                  <h2>RECOMMENDED ITEMS AND RESTAURANTS</h2>
                </Row>
                <Row>
                  <Col md={8} lg={8}>
                    <RecommendedItems
                      recommended={recommendedItems}
                      handleRestaurantSelectParent={(restaurantId) =>
                        setSelectedRestaurantId(restaurantId)
                      }
                    />
                  </Col>
                  <Col md={4} lg={4}>
                    <RecommendedRestaurants
                      recommended={recommendedRestaurants}
                      handleRestaurantSelectParent={(restaurantId) =>
                        setSelectedRestaurantId(restaurantId)
                      }
                    />
                  </Col>
                </Row>
              </>
            )}
          </Tab.Pane>

          <Tab.Pane eventKey="promotions-table">
            {selectedRestaurantId ? (
              <RestaurantPage restaurantId={selectedRestaurantId} />
            ) : (
              <>
                <PromotionsTable
                  items={promotedItems}
                  promotions={promotions}
                  handleRestaurantSelectParent={(restaurantId) =>
                    setSelectedRestaurantId(restaurantId)
                  }
                />
              </>
            )}
          </Tab.Pane>

          <Tab.Pane eventKey="orders-table">
            {selectedRestaurantId ? (
              <RestaurantPage restaurantId={selectedRestaurantId} />
            ) : (
              <Row>
                <Col>
                  <OrdersTable
                    orders={ordersCustomerHistory}
                    handleOrderSelectParent={() => {}}
                    handleRestaurantSelectParent={(restaurantId) =>
                      setSelectedRestaurantId(restaurantId)
                    }
                    refreshOrdersParent={() =>
                      handleFetchOrdersHistory(
                        token,
                        userId,
                        setOrdersCustomerHistory
                      )
                    }
                  />
                </Col>
              </Row>
            )}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default CustomerPage;
