import React, { createContext, useContext, useState } from "react";

const ActionPermissionContext = createContext();

export const useActionPermissionContext = () =>
  useContext(ActionPermissionContext);

export const ActionPermissionProvider = ({ children }) => {
  const [actionPermission, setActionPermission] = useState(() => {
    const storedActionPermission = localStorage.getItem("action_permission");
    return storedActionPermission ? storedActionPermission : "";
  });

  return (
    <ActionPermissionContext.Provider
      value={{ actionPermission, setActionPermission }}
    >
      {children}
    </ActionPermissionContext.Provider>
  );
};
