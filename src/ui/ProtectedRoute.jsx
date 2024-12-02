import styled from "styled-components";
import { useUser } from "../features/authentication/hooks/useUser";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useActionPermissionContext } from "../context/ActionPermissionContext"; // Adjust the path as needed

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  // 1. Load the authenticated user
  const { isPending, isAuthenticated } = useUser();
  const { setActionPermission } = useActionPermissionContext(); // Access setActionPermission from context

  useEffect(() => {
    const storedActionPermission = localStorage.getItem("action_permission");
    setActionPermission(storedActionPermission);
  }, [setActionPermission]);

  // 2. If there is NO authenticated user, redirect to the /login
  useEffect(
    function () {
      if (!isAuthenticated && !isPending) navigate("/login");
    },
    [isAuthenticated, isPending, navigate]
  );

  // 3. While loading, show a spinner
  if (isPending)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  // 4. If there IS a user, render the app
  if (isAuthenticated) return children;
}

export default ProtectedRoute;
