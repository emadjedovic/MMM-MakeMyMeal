import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Container, Tab, Nav, Pagination } from "react-bootstrap";
import "../css/App.css";

import CreatePersonnelForm from "../components/onlyRestaurantAdmin/CreatePersonnelForm";
import RAdminRestaurantsTable from "../components/onlyRestaurantAdmin/RAdminRestaurantsTable";
import Restaurant from "../components/Restaurant";

import {
  handleFetchRestaurantsByOwner,
  handleFetchRestaurantTypes,
  handleEditClick,
  handleChange,
  handleSave,
  handlePageChange,
  handleRestaurantSelectParent,
  handlePopState,
} from "../handlers/radminHandlers";

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
        onClick={() => handlePageChange(number, setCurrentPage)}
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
    <Container>
      <Tab.Container defaultActiveKey="my-restaurants">
        <Nav
          variant="underline"
          className="mb-3"
          onSelect={() => handlePopState(setSelectedRestaurantId)}
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
              <Restaurant restaurantId={selectedRestaurantId} />
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
                handlePageChange={(pageNumber) =>
                  handlePageChange(pageNumber, setCurrentPage)
                }
                restaurantTypes={restaurantTypes}
                handleRestaurantSelectParent={(restaurantId) =>
                  handleRestaurantSelectParent(
                    restaurantId,
                    setSelectedRestaurantId
                  )
                }
              />
            )}
          </Tab.Pane>
          <Tab.Pane eventKey="personnel">
            <CreatePersonnelForm/>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default RestaurantAdminPage;
