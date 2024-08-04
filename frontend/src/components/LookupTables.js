// src/components/LookupTables.js
import React from "react";
import RestaurantTypeForm from "./RestaurantTypeForm";

const LookupTables = ({ restaurantTypes, onAddType, onRenameType, onDeleteType }) => {
  return (
    <div>
      <div className="mb-4">
        <RestaurantTypeForm action="add" onSubmit={onAddType} restaurantTypes={restaurantTypes} />
      </div>
      <div className="mb-4">
        <RestaurantTypeForm action="rename" onSubmit={onRenameType} restaurantTypes={restaurantTypes}/>
      </div>
      <div className="mb-4">
        <RestaurantTypeForm action="delete" onSubmit={onDeleteType} restaurantTypes={restaurantTypes}/>
      </div>
    </div>
  );
};

export default LookupTables;
