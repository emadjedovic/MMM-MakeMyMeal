import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Container,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";
import { UserContext } from "../UserContext";

const RAdminRestaurantsTable = () => {
  const { token, user } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [restaurants, setRestaurants] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editableData, setEditableData] = useState({});

  const userId = user.id

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/restaurants/owner/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, [userId, token]);

  const handleEditClick = (id, data) => {
    setEditId(id);
    setEditableData(data);
  };

  const handleChange = (e) => {
    setEditableData({
      ...editableData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(
        `http://localhost:8000/api/restaurants/update/${id}`,
        editableData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditId(null);
      setEditableData({});
      const response = await axios.get(
        `http://localhost:8000/api/restaurants/owner/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error updating restaurant:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastRestaurant = currentPage * itemsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - itemsPerPage;
  const currentRestaurants = restaurants.slice(
    indexOfFirstRestaurant,
    indexOfLastRestaurant
  );

  const totalPages = Math.ceil(restaurants.length / itemsPerPage);
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => handlePageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <Container className="my-4">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Street Name</th>
            <th>City</th>
            <th>Star Rating</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRestaurants.map((restaurant) => (
            <tr key={restaurant.id}>
              <td>{restaurant.id}</td>
              <td>
                {editId === restaurant.id ? (
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={editableData.name || ""}
                    onChange={handleChange}
                  />
                ) : (
                  restaurant.name
                )}
              </td>
              <td>
                {editId === restaurant.id ? (
                  <input
                    type="number"
                    step="0.001"
                    name="latitude"
                    className="form-control"
                    value={editableData.latitude || ""}
                    onChange={handleChange}
                  />
                ) : (
                  restaurant.latitude.toFixed(3)
                )}
              </td>
              <td>
                {editId === restaurant.id ? (
                  <input
                    type="number"
                    step="0.001"
                    name="longitude"
                    className="form-control"
                    value={editableData.longitude || ""}
                    onChange={handleChange}
                  />
                ) : (
                  restaurant.longitude.toFixed(3)
                )}
              </td>
              <td>
                {editId === restaurant.id ? (
                  <input
                    type="text"
                    name="street_name"
                    className="form-control"
                    value={editableData.street_name || ""}
                    onChange={handleChange}
                  />
                ) : (
                  restaurant.street_name
                )}
              </td>
              <td>
                {editId === restaurant.id ? (
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    value={editableData.city || ""}
                    onChange={handleChange}
                  />
                ) : (
                  restaurant.city
                )}
              </td>
              <td>
                {editId === restaurant.id ? (
                  <input
                    type="number"
                    name="star_rating"
                    className="form-control"
                    value={editableData.star_rating || ""}
                    onChange={handleChange}
                  />
                ) : (
                  restaurant.star_rating
                )}
              </td>
              <td>
                {editId === restaurant.id ? (
                  <input
                    type="text"
                    name="type"
                    className="form-control"
                    value={editableData.type || ""}
                    onChange={handleChange}
                  />
                ) : (
                  restaurant.type
                )}
              </td>
              <td>
                {editId === restaurant.id ? (
                  <Button onClick={() => handleSave(restaurant.id)}>Save</Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => handleEditClick(restaurant.id, restaurant)}
                  >
                    Edit
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>{paginationItems}</Pagination>
    </Container>
  );
};

export default RAdminRestaurantsTable;
