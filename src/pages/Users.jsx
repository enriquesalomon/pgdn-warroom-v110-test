import Heading from "../ui/Heading";
import Row from "../ui/Row";
import AddUserPL from "../features/users/pl/components/AddUserPL";
import UserTableOperationsPL from "../features/users/pl/components/UserTableOperationsPL";
import UserTablePL from "../features/users/pl/components/UserTablePL";

import AddUserBaco from "../features/users/baco/components/AddUserBaco";
// import UserTableOperationsPL from "../features/users/baco/components/UserTableOperationsPL";
import UserTableBaco from "../features/users/baco/components/UserTableBaco";

import AddUser from "../features/users/admin/components/AddUser";
import UserTableOperations from "../features/users/admin/components/UserTableOperations";
import UserTable from "../features/users/admin/components/UserTable";

import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { useActionPermissionContext } from "../context/ActionPermissionContext";
import { parseAction, parsePage } from "../utils/helpers";
import styled from "styled-components";
import { useQueryClient } from "@tanstack/react-query";
import { useLogedInUser } from "../features/authentication/hooks/useUser";
import Spinner from "../ui/Spinner";
// import BarangayFilterAll from "../ui/BarangayFilterAll";
import UserTableStaff from "../features/users/app_staff/components/UserTableStaff";
import AddUserStaff from "../features/users/app_staff/components/AddUserStaff";

const StyledBox = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 1rem;

  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;
function NewUsers() {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const { isPending, data: account_role } = useLogedInUser(userData.id);
  const shouldRender_AdminUserTable = account_role?.account_role !== "Staff";
  const { pagePermission } = usePagePermissionContext();

  const isAllowed = parsePage(pagePermission, "users");

  const { actionPermission } = useActionPermissionContext();
  // const isAllowedAction_pl_user = parseAction(actionPermission, "add PL user");
  const isAllowedAction_admin_user = parseAction(
    actionPermission,
    "add admin user"
  );
  const isAllowedAction_baco_user = parseAction(
    actionPermission,
    "add Baco user"
  );
  const isAllowedAction_mobileApp_user = parseAction(
    actionPermission,
    "add Mobile app user"
  );
  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  if (isPending) return <Spinner />;
  return (
    <>
      <div>
        <Row type="horizontal">
          <Heading as="h2">USER ACCOUNT</Heading>
          {/* <DashboardFilter /> */}
        </Row>
        <hr className="border-t-1 border-gray-300" />
      </div>
      {/* <div>
        <StyledBox>
          <Row type="horizontal">
            <Heading as="h2">Tower App Users</Heading>
            <BarangayFilterAll />
          </Row>
          <Row type="horizontal">
            <Heading as="h2"></Heading>
            <UserTableOperationsPL />
          </Row>

          <Row>
            {isAllowedAction_pl_user ? <AddUserPL /> : null}
            <UserTablePL />
          </Row>
        </StyledBox>
      </div> */}

      {/* <div>
        <StyledBox>
          <Row type="horizontal">
            <Heading as="h2"></Heading>
          </Row>
          <Row type="horizontal">
            <Heading as="h2">Baco App Users</Heading>
            <UserTableOperationsPL />
          </Row>

          <Row>
            {isAllowedAction_baco_user ? <AddUserBaco /> : null}
            <UserTableBaco />
          </Row>
        </StyledBox>
      </div> */}
      <div>
        <StyledBox>
          <Row type="horizontal">
            <Heading as="h2"></Heading>
          </Row>
          <Row type="horizontal">
            <Heading as="h2">Staff Mobile App Users</Heading>
            <UserTableOperationsPL />
          </Row>

          <Row>
            {isAllowedAction_mobileApp_user ? <AddUserStaff /> : null}
            <UserTableStaff />
          </Row>
        </StyledBox>
      </div>

      <div>
        {isAllowedAction_admin_user && (
          <>
            <StyledBox>
              <Row type="horizontal">
                <Heading as="h2">Portal Users</Heading>
                <UserTableOperations />
              </Row>

              <Row>
                <AddUser />
                <UserTable />
              </Row>
            </StyledBox>
          </>
        )}
      </div>
    </>
  );
}

export default NewUsers;
