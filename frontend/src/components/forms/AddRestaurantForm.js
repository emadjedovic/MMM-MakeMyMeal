import React, { useContext, useState, useEffect } from "react";
import { createRestaurant } from "../../api/restaurantsApi";
import { fetchRestaurantTypes } from "../../api/restaurantTypesApi";
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

const AddRestaurantForm = ({ onAdd }) => {
  const { token } = useContext(UserContext);
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [streetName, setStreetName] = useState("");
  const [city, setCity] = useState("");
  const [starRating, setStarRating] = useState(0);
  const [type, setType] = useState("");
  const [radiusOfDeliveryKm, setRadiusOfDeliveryKm] = useState(0);
  const [ownerId, setOwnerId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const data = await fetchRestaurantTypes();
        setTypes(data);
        if (data.length > 0) {
          setType(data[0].name);
        }
      } catch (error) {
        console.error("Error in fetchTypes.");
      }
    };

    fetchTypes();
  }, [token]);

  const requestData = {
    name: name,
    latitude: latitude,
    longitude: longitude,
    street_name: streetName,
    city: city,
    star_rating: starRating || 0,
    type_name: type,
    radius_of_delivery_km: radiusOfDeliveryKm || 0,
    owner_id: ownerId,
    imageUrl: imageUrl
      ? "restaurant-images/" + imageUrl
      : "restaurant-images/restDefault.png",
  };

  const clear = () => {
    setName("");
    setLatitude("");
    setLongitude("");
    setStreetName("");
    setCity("");
    setStarRating(0);
    setType(types.length > 0 ? types[0].name : "");
    setRadiusOfDeliveryKm(0);
    setOwnerId("");
    setImageUrl("");
  };

  const handleAddRestaurant = async () => {
    try {
      console.log("sending data: ", requestData);
      const data = await createRestaurant(token, requestData);
      setMessage("Restaurant added successfully!");
      onAdd(data);
      clear();
    } catch (error) {
      setMessage("Error adding the restaurant.");
    }
  };

  return (
    <Container className="my-4" style={{ maxWidth: "400px" }}>
      <Card>
        <Card.Body>
          <h3>ADD A RESTAURANT</h3>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Restaurant Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter restaurant name"
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group controlId="formLatitude">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control
                    type="number"
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    placeholder="43.856430"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formLongitude">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control
                    type="number"
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    placeholder="18.413029"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="formStreetName">
              <Form.Label>Street Name</Form.Label>
              <Form.Control
                type="text"
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
                placeholder="Enter street name"
              />
            </Form.Group>
            <Form.Group controlId="formCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Sarajevo"
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
              onClick={() => setStarRating(0)}
              style={{ margin: "1rem" }}
            >
              Clear Selection
            </Button>
            <Form.Group controlId="formType">
              <Form.Label>Restaurant Type</Form.Label>
              <Form.Control
                as="select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {types.map((typeOption) => (
                  <option key={typeOption.name} value={typeOption.name}>
                    {typeOption.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formRadiusOfDelivery">
              <Form.Label>Radius of Delivery in km</Form.Label>
              <Form.Control
                type="range"
                min="0"
                max="10"
                value={radiusOfDeliveryKm}
                onChange={(e) => setRadiusOfDeliveryKm(Number(e.target.value))}
              />
              <Form.Text className="text-muted">
                {radiusOfDeliveryKm} km
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formOwnerId">
              <Form.Label>Owner ID</Form.Label>
              <Form.Control
                type="number"
                value={ownerId}
                onChange={(e) => setOwnerId(Number(e.target.value))}
                placeholder="Enter owner ID"
                min="0"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                value={imageUrl}
                name="imageUrl"
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="for example 'my_image.jpg'"
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={handleAddRestaurant}
              style={{ margin: "1rem" }}
            >
              Add Restaurant
            </Button>
          </Form>
        </Card.Body>
      </Card>
      {message && (
        <Alert
          variant={message.includes("Error") ? "danger" : "success"}
          className="mt-3"
        >
          {message}
        </Alert>
      )}
    </Container>
  );
};

export default AddRestaurantForm;
