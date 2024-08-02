import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Container, Tab, Nav, Pagination } from "react-bootstrap";
import "../css/App.css";
import CreatePersonnelForm from "../components/CreatePersonnelForm";
import RAdminRestaurantsTable from "../components/RAdminRestaurantsTable";
import { fetchRestaurantsByOwner, updateRestaurant } from "../services/api";

const RestaurantAdminPage = () => {
  const { token, user } = useContext(UserContext);
  const [restaurants, setRestaurants] = useState([]);
  const [editableData, setEditableData] = useState({});
  const [editId, setEditId] = useState(null);
  const userId = user.id;
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const data = await fetchRestaurantsByOwner(userId, token);
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    getRestaurants();
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
      await updateRestaurant(id, editableData, token);
      setEditId(null);
      setEditableData({});
      const data = await fetchRestaurantsByOwner(userId, token);
      setRestaurants(data);
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

  const handlePersonnelCreated = (dp) => {
    console.log("New delivery personnel created:", dp);
  };

  return (
    <Container>
      <Tab.Container defaultActiveKey="restaurants">
        <Nav variant="underline" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="restaurants">My Restaurants</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="manage-personnel">Manage Personnel</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="restaurants">
            <RAdminRestaurantsTable
              restaurants={currentRestaurants}
              editId={editId}
              editableData={editableData}
              handleEditClick={handleEditClick}
              handleChange={handleChange}
              handleSave={handleSave}
              paginationItems={paginationItems}
              handlePageChange={handlePageChange}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="manage-personnel">
            <CreatePersonnelForm onPersonnelCreated={handlePersonnelCreated} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default RestaurantAdminPage;
