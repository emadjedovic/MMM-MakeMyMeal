import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Form, Container, Col, Row } from "react-bootstrap";

const OrdersMapA = ({
  restaurants,
  selectedRestaurantName,
  deliveryId,
  date,
  orders,
  setSelectedRestaurantName,
  setDeliveryId,
  setDate,
}) => {
  const STATUS_MARKERS = {
    "NOT ASSIGNED": "./pin-yellow.png",
    ASSIGNED: "./pin-red.png",
    "IN PROGRESS": "./pin-blue.png",
    COMPLETED: "./pin-green.png",
  };

  const markerIcon = (status) =>
    L.icon({
      iconUrl: STATUS_MARKERS[status] || STATUS_MARKERS["NOT ASSIGNED"],
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

  return (
    <Container className="my-4">
      <Row className="mb-3">
        <Col md={6} lg={5}>
          <Form.Control
            as="select"
            value={selectedRestaurantName}
            onChange={(e) => setSelectedRestaurantName(e.target.value)}
          >
            <option value="">Select Restaurant</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.name}>
                {restaurant.name}
              </option>
            ))}
          </Form.Control>
        </Col>

        <Col md={2} lg={2}>
          <Form.Control
            type="text"
            placeholder="Delivery ID"
            value={deliveryId}
            onChange={(e) => setDeliveryId(e.target.value)}
          />
        </Col>

        <Col md={4} lg={5}>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Col>
      </Row>

      <div style={{ height: "500px", width: "100%" }}>
        <MapContainer
          center={[43.8486, 18.3564]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {orders.map((order) => {
            const { latitude, longitude, status, id } = order;
            return (
              <Marker
                key={id}
                position={[latitude, longitude]}
                icon={markerIcon(status)}
              >
                <Popup>
                  <div>
                    <h3>Order ID: {id}</h3>
                    <p>Status: {status}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </Container>
  );
};

export default OrdersMapA;
