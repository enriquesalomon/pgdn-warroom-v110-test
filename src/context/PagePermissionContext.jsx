import React, { createContext, useContext, useState } from "react";

const PagePermissionContext = createContext();

export const usePagePermissionContext = () => useContext(PagePermissionContext);

export const PagePermissionProvider = ({ children }) => {
  const [pagePermission, setPagePermission] = useState(() => {
    // Retrieve pagePermission from local storage on initial render
    const storedPagePermission = localStorage.getItem("page_permission");
    return storedPagePermission ? storedPagePermission : "";
  });

  return (
    <PagePermissionContext.Provider
      value={{ pagePermission, setPagePermission }}
    >
      {children}
    </PagePermissionContext.Provider>
  );
};
