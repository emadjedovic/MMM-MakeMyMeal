import React from "react";
import { Table, Pagination } from "react-bootstrap";
import ThemedButton from "../ThemedButton";

const RAdminRestaurantsTable = ({
  restaurants,
  editId,
  editableData,
  handleEditClick,
  handleChange,
  handleSave,
  paginationItems,
  restaurantTypes,
  handleRestaurantSelectParent,
}) => {
  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Longitude</th>
            <th>Street Name</th>
            <th>City</th>
            <th>Star Rating</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((restaurant) => (
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
                  <ThemedButton
                    variant="link"
                    onClick={() => handleRestaurantSelectParent(restaurant.id)}
                  >
                    {restaurant.name}
                  </ThemedButton>
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
                  restaurant.latitude.toFixed(5)
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
                  restaurant.longitude.toFixed(5)
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
                  <select
                    name="type_name"
                    className="form-control"
                    value={editableData.type_name || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Type</option>
                    {restaurantTypes.map((type) => (
                      <option key={type.name} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  restaurant.type_name
                )}
              </td>
              <td>
                {editId === restaurant.id ? (
                  <ThemedButton onClick={() => handleSave(restaurant.id)}>
                    Save
                  </ThemedButton>
                ) : (
                  <ThemedButton
                    variant="primary"
                    onClick={() => handleEditClick(restaurant.id, restaurant)}
                  >
                    Edit
                  </ThemedButton>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>{paginationItems}</Pagination>
    </>
  );
};

export default RAdminRestaurantsTable;
