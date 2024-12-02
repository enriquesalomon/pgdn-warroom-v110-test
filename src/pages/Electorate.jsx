import React from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import ElectoratesTable from "../features/electorate/components/ElectoratesTable";
// import AddElectorate from "../features/electorate/components/AddElectorate";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
// import { useActionPermissionContext } from "../context/ActionPermissionContext";
import { parseAction, parsePage } from "../utils/helpers";
import BarangayFilter from "../ui/BarangayFilter";

export default function Electorate() {
  const viewable_brgy = localStorage.getItem("viewable_brgy");
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(pagePermission, "electorate");
  // const { actionPermission } = useActionPermissionContext();
  // const isAllowedAction = parseAction(actionPermission, "add electorate");

  if (!isAllowed) {
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">ELECTORATES</Heading>
        <BarangayFilter viewable_brgy={viewable_brgy} />
      </Row>
      <hr className="border-t-1 border-gray-300" />

      <Row>
        {/* {isAllowedAction ? <AddElectorate /> : null} */}
        <ElectoratesTable />
      </Row>
    </>
  );
}
