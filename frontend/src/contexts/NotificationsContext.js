import React, { createContext, useState } from "react";

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [newNotification, setNewNotification] = useState(false);

  const markNotificationsAsRead = () => {
    setNewNotification(false);
  };

  return (
    <NotificationsContext.Provider
      value={{ newNotification, setNewNotification, markNotificationsAsRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
