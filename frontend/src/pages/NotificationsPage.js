import React, {useState, useEffect} from "react";
import {toast, ToastContainer} from "react-toastify"

/*
    - Notifikacije administratoru restorana kada stigne nova narudžba i kada dostavljač promijeni status narudžbe (sa ASSIGNED na IN PROGRESS ili COMPLETED)*/

const NotificationsPage = () => {
  /*
attributes like id, user_id, restaurant_id, order_id, type (e.g., NEW_ORDER, STATUS_CHANGE), message, read_status, and timestamp
*/


  return (
    <div>
      <h1>Notifications</h1>
    </div>
  );
};

export default NotificationsPage;
