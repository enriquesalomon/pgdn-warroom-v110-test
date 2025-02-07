import Heading from "../ui/Heading";
import Row from "../ui/Row";
// import AddLeader from "../features/leaders/components/AddLeader";
// import LeaderTableOperations from "../features/leaders/components/LeaderTableOperations";
// import LeaderTable from "../features/leaders/components/LeaderTable";

import AddTeam from "../features/teams/components/AddTeam";
import TeamTable from "../features/teams/components/TeamTable";

import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { useActionPermissionContext } from "../context/ActionPermissionContext";

import { parseAction, parsePage } from "../utils/helpers";
import BarangayFilter from "../ui/BarangayFilter";

function Leaders() {
  const viewable_brgy = localStorage.getItem("viewable_brgy");
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(pagePermission, "teams");
  const { actionPermission } = useActionPermissionContext();
  const isAllowedAction = parseAction(actionPermission, "add team");

  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">TEAMS</Heading>
        <BarangayFilter viewable_brgy={viewable_brgy} />
      </Row>
      <hr className="border-t-1 border-gray-300" />

      <Row>
        {isAllowedAction ? <AddTeam /> : null}
        <TeamTable />
      </Row>
    </>
  );
}

export default Leaders;
