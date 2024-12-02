import React from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import AddSpecialElectorate from "../features/special-electorate/components/AddSpecialElectorate";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { useActionPermissionContext } from "../context/ActionPermissionContext";
import { parseAction, parsePage } from "../utils/helpers";
import SpecialElectorateTable from "../features/special-electorate/components/SpecialElectorateTable";
import BarangayFilter from "../ui/BarangayFilter";
import ListFilter from "../features/special-electorate/components/ListFilter";

export default function SpecialElectorate() {
  const viewable_brgy = localStorage.getItem("viewable_brgy");
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(pagePermission, "special_electorate");
  const { actionPermission } = useActionPermissionContext();
  const isAllowedAction = parseAction(
    actionPermission,
    "tag special electorate"
  );

  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">Special Electorate</Heading>
        <BarangayFilter viewable_brgy={viewable_brgy} />
      </Row>
      <hr className="border-t-1 border-gray-300" />
      <Row type="horizontal">
        <div></div>
        <ListFilter />
      </Row>
      <Row>
        {isAllowedAction ? <AddSpecialElectorate /> : null}
        <SpecialElectorateTable />
      </Row>
    </>
  );
}
