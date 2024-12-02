import React from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { useActionPermissionContext } from "../context/ActionPermissionContext";
import { parseAction, parsePage } from "../utils/helpers";
import BarangayFilter from "../ui/BarangayFilter";
import ListFilter from "../features/scan_verify/components/ListFilter";
import AddVerify from "../features/scan_verify/components/AddVerify";
import VotersTable from "../features/scan_verify/components/VotersTable";
// import BarangayFilter from "../ui/BarangayFilter";

export default function ScanVerify() {
  const viewable_brgy = localStorage.getItem("viewable_brgy");
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(pagePermission, "scan_verify");
  const { actionPermission } = useActionPermissionContext();
  const isAllowedAction = true;

  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">Affirmative Voters</Heading>
        <BarangayFilter viewable_brgy={viewable_brgy} />
      </Row>
      <hr className="border-t-1 border-gray-300" />
      <Row type="horizontal">
        <div></div>
        <ListFilter />
      </Row>
      <Row>
        {isAllowedAction ? <AddVerify /> : null}
        <VotersTable />
      </Row>
    </>
  );
}
