import React from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import LeadersTable from "../features/reports/rpt_LeaderHierarchy/components/LeadersTable";
// import LeaderFilterStatus from "../features/leaders/components/LeaderFilterStatus";
// import AddLeader from "../features/leaders/components/AddLeader";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { useActionPermissionContext } from "../context/ActionPermissionContext";
import { parseAction, parsePage } from "../utils/helpers";
import BarangayFilter from "../ui/BarangayFilter";
// import ListFilter from "../features/leaders/components/ListFilter";
import ListFilter from "../features/reports/rpt_LeaderHierarchy/components/ListFilter";
// import BarangayFilter from "../ui/BarangayFilter";

export default function RptLeaderHierarchy() {
  const viewable_brgy = localStorage.getItem("viewable_brgy");
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(pagePermission, "rpt_leader_hierarchy");
  const { actionPermission } = useActionPermissionContext();
  const isAllowedAction = parseAction(actionPermission, "add baco");

  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">LEADERS</Heading>
        {/* <LeaderFilterStatus /> */}
        <BarangayFilter viewable_brgy={viewable_brgy} />
      </Row>
      <hr className="border-t-1 border-gray-300" />
      {/* <Row type="horizontal">
        <div></div>
        <ListFilter />
      </Row> */}
      <Row>
        <LeadersTable />
      </Row>
    </>
  );
}
