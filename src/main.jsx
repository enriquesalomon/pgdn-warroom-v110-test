import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ui/ErrorFallback";
import { PagePermissionProvider } from "./context/PagePermissionContext";
import { ActionPermissionProvider } from "./context/ActionPermissionContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.replace("/")}
    >
      <PagePermissionProvider>
        <ActionPermissionProvider>
          <App />
        </ActionPermissionProvider>
      </PagePermissionProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
