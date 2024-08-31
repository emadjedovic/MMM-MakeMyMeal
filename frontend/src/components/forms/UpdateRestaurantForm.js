import React, { useContext, useState, useEffect } from "react";
import {
  Form,
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
} from "react-bootstrap";
import { UserContext } from "../../contexts/UserContext";
import { handleFetchRestaurantTypes } from "../../handlers/RestaurantPageHandlers";
import { handleUpdateRestaurant } from "../../handlers/RestaurantPageHandlers";

const UpdateRestaurantForm = ({ onUpdate }) => {
  const { token } = useContext(UserContext);
  const [updateId, setUpdateId] = useState("");
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [streetName, setStreetName] = useState("");
  const [city, setCity] = useState("");
  const [starRating, setStarRating] = useState("");
  const [type, setType] = useState("");
  const [radiusOfDeliveryKm, setRadiusOfDeliveryKm] = useState(0);
  const [isArchived, setIsArchived] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [restaurantTypes, setRestaurantTypes] = useState([]);

  useEffect(() => {
    handleFetchRestaurantTypes(setRestaurantTypes);
  }, [token]);

  const requestData = {
    name: name || undefined,
    latitude: latitude || undefined,
    longitude: longitude || undefined,
    street_name: streetName || undefined,
    city: city || undefined,
    star_rating: starRating || undefined,
    type_name: type || undefined,
    radius_of_delivery_km: radiusOfDeliveryKm || undefined,
    is_archived: isArchived,
    imageUrl: imageUrl ? "restaurant-images/" + imageUrl : undefined,
  };

  const clear = () => {
    setUpdateId("");
    setName("");
    setLatitude("");
    setLongitude("");
    setStreetName("");
    setCity("");
    setStarRating("");
    setType("");
    setRadiusOfDeliveryKm(0);
    setIsArchived(false);
    setImageUrl("");
  };

  const handleUpdate = async () => {
    handleUpdateRestaurant(token, updateId, requestData, onUpdate, setMessage);
    clear();
  };

  return (
    <Container className="my-4" style={{ maxWidth: "400px" }}>
      <Card>
        <Card.Body>
          <h3>UPDATE A RESTAURANT</h3>
          <Form>
            <Form.Group controlId="formUpdateId">
              <Form.Label>Restaurant ID</Form.Label>
              <Form.Control
                type="number"
                value={updateId}
                onChange={(e) => setUpdateId(Number(e.target.value))}
                placeholder="Enter restaurant ID"
                min="0"
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Restaurant Name (optional)</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter restaurant name"
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group controlId="formLatitude">
                  <Form.Label>Latitude (optional)</Form.Label>
                  <Form.Control
                    type="number"
                    name="latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    placeholder="Enter latitude"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formLongitude">
                  <Form.Label>Longitude (optional)</Form.Label>
                  <Form.Control
                    type="number"
                    name="longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    placeholder="Enter longitude"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="formStreetName">
              <Form.Label>Street Name (optional)</Form.Label>
              <Form.Control
                type="text"
                name="street_name"
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
                placeholder="Enter street name"
              />
            </Form.Group>
            <Form.Group controlId="formCity">
              <Form.Label>City (optional)</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
              />
            </Form.Group>
            <Form.Group controlId="formStarRating">
              <Form.Label>Star Rating (optional)</Form.Label>
              <div className="d-flex">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Form.Check
                    inline
                    key={rating}
                    type="radio"
                    id={`star_rating_${rating}`}
                    name="star_rating"
                    value={rating}
                    checked={starRating === rating}
                    onChange={(e) => setStarRating(Number(e.target.value))}
                    label={rating}
                  />
                ))}
              </div>
            </Form.Group>
            <Button
              variant="secondary"
              onClick={() => setStarRating("")}
              style={{ margin: "1rem" }}
            >
              Clear Selection
            </Button>
            <Form.Group controlId="formType">
              <Form.Label>Restaurant Type (optional)</Form.Label>
              <Form.Control
                as="select"
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Select a type</option>
                {restaurantTypes.map((rt) => (
                  <option key={rt.id} value={rt.name}>
                    {rt.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formRadiusOfDelivery">
              <Form.Label>Radius of Delivery in km (optional)</Form.Label>
              <Form.Control
                type="range"
                name="radius_of_delivery_km"
                min="0"
                max="10"
                value={radiusOfDeliveryKm}
                onChange={(e) => setRadiusOfDeliveryKm(Number(e.target.value))}
              />
              <Form.Text className="text-muted">
                {radiusOfDeliveryKm} km
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formIsArchived">
              <Form.Check
                type="checkbox"
                name="is_archived"
                checked={isArchived}
                onChange={(e) => setIsArchived(e.target.checked)}
                label="Archived"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                value={imageUrl}
                name="imageUrl"
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="my_image.jpg"
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={handleUpdate}
              style={{ margin: "1rem" }}
            >
              Update Restaurant
            </Button>
          </Form>
        </Card.Body>
      </Card>
      {message && (
        <Alert
          variant={message.includes("error") ? "danger" : "success"}
          className="mt-3"
        >
          {message}
        </Alert>
      )}
    </Container>
  );
};

export default UpdateRestaurantForm;
