import Heading from "../ui/Heading";
import Row from "../ui/Row";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { useActionPermissionContext } from "../context/ActionPermissionContext";

import { parseAction, parsePage } from "../utils/helpers";
import BarangayFilter from "../ui/BarangayFilter";
import styled from "styled-components";
import RequestTablePending from "../features/request/components/RequestTablePending";
import RequestTableCompleted from "../features/request/components/RequestTableCompleted";

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
function Request() {
  const viewable_brgy = localStorage.getItem("viewable_brgy");
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(pagePermission, "team_request");
  const { actionPermission } = useActionPermissionContext();
  const isAllowedAction = parseAction(
    actionPermission,
    "team request approval"
  );

  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <div>
        <Row type="horizontal">
          <Heading as="h2">REQUEST</Heading>
        </Row>
        <hr className="border-t-1 border-gray-300" />
      </div>
      <div>
        <StyledBox>
          <Row type="horizontal">
            <Heading as="h2">Pending</Heading>
            <BarangayFilter viewable_brgy={viewable_brgy} />
          </Row>

          <Row>
            <RequestTablePending />
          </Row>
        </StyledBox>
      </div>

      <div>
        <StyledBox>
          <Row type="horizontal">
            <Heading as="h2">Completed</Heading>
            <BarangayFilter viewable_brgy={viewable_brgy} />
          </Row>

          <Row>
            <RequestTableCompleted />
          </Row>
        </StyledBox>
      </div>
    </>
  );
}

export default Request;
