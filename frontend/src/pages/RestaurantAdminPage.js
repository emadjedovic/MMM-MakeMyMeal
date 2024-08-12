import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Container, Tab, Nav, Pagination } from "react-bootstrap";
import "../css/App.css";

import CreatePersonnelForm from "../components/restaurantadmin/CreatePersonnelForm";
import RAdminRestaurantsTable from "../components/restaurantadmin/RAdminRestaurantsTable";
import RestaurantPage from "../components/RestaurantPage";

import {
  handleFetchRestaurantsByOwner,
  handleFetchRestaurantTypes,
  handleEditClick,
  handleSave,
  handleChange,
} from "../handlers/RestaurantAdminPageHandlers";

const RestaurantAdminPage = () => {
  const { token, user } = useContext(UserContext);
  const [restaurants, setRestaurants] = useState([]);
  const [editableData, setEditableData] = useState({});
  const [editId, setEditId] = useState(null);
  const [restaurantTypes, setRestaurantTypes] = useState([]);
  const userId = user.id;
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

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
        onClick={(pageNumber) => setCurrentPage(pageNumber)}
      >
        {number}
      </Pagination.Item>
    );
  }

  useEffect(() => {
    handleFetchRestaurantsByOwner(userId, token, setRestaurants);
    handleFetchRestaurantTypes(token, setRestaurantTypes);
  }, [userId, token]);

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
      <Tab.Container defaultActiveKey="my-restaurants">
        <Nav
          variant="underline"
          className="mb-3"
          onSelect={() => setSelectedRestaurantId(null)}
        >
          <Nav.Item>
            <Nav.Link eventKey="my-restaurants">My Restaurants</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="personnel">Personnel</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="my-restaurants">
            {selectedRestaurantId ? (
              <RestaurantPage restaurantId={selectedRestaurantId} />
            ) : (
              <RAdminRestaurantsTable
                restaurants={currentRestaurants}
                editId={editId}
                editableData={editableData}
                handleEditClick={(id, data) =>
                  handleEditClick(id, data, setEditId, setEditableData)
                }
                handleChange={(e) =>
                  handleChange(e, editableData, setEditableData)
                }
                handleSave={(id) =>
                  handleSave(
                    id,
                    editableData,
                    token,
                    userId,
                    setEditId,
                    setEditableData,
                    setRestaurants
                  )
                }
                paginationItems={paginationItems}
                handlePageChange={(pageNumber) => setCurrentPage(pageNumber)}
                restaurantTypes={restaurantTypes}
                handleRestaurantSelectParent={(restaurantId) =>
                  setSelectedRestaurantId(restaurantId)
                }
              />
            )}
          </Tab.Pane>
          <Tab.Pane eventKey="personnel">
            <CreatePersonnelForm />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default RestaurantAdminPage;
