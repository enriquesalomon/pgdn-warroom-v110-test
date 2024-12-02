import React from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import BacoTable from "../features/baco/components/BacoTable";
import BacoFilterStatus from "../features/baco/components/BacoFilterStatus";
import AddBaco from "../features/baco/components/AddBaco";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { useActionPermissionContext } from "../context/ActionPermissionContext";
import { parseAction, parsePage } from "../utils/helpers";
// import BarangayFilter from "../ui/BarangayFilter";

export default function Baco() {
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(pagePermission, "baco");
  const { actionPermission } = useActionPermissionContext();
  const isAllowedAction = parseAction(actionPermission, "add baco");

  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">BACO</Heading>
        <BacoFilterStatus />
      </Row>
      <hr className="border-t-1 border-gray-300" />
      <Row>
        {isAllowedAction ? <AddBaco /> : null}
        <BacoTable />
      </Row>
    </>
  );
}
