import React from "react";
import { Modal, Button, Row, Col, ListGroup } from "react-bootstrap";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const OrderLocationMap = ({ show, onHide, order }) => {
  const {
    id,
    latitude,
    longitude,
    payment_method,
    total_price,
    preferred_arrival_time,
  } = order;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Body closeButton>
        <Row>
          <Col md={8}>
            <div style={{ height: "350px", width: "100%" }}>
              <MapContainer
                center={[latitude, longitude]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[latitude, longitude]} />
              </MapContainer>
            </div>
          </Col>
          <Col md={4}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h4>ORDER #{id}</h4>
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Payment Method</strong>
                <br></br>
                {payment_method}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Total Price</strong>
                <br></br>${total_price}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Preferred Arrival Time</strong>
                <br></br>
                {new Date(preferred_arrival_time).toLocaleString()}
              </ListGroup.Item>
            </ListGroup>
            <Button
              variant="secondary"
              onClick={onHide}
              style={{ marginTop: "10%", float: "right" }}
            >
              Close
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default OrderLocationMap;
