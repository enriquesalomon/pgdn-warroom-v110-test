import React from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { parsePage } from "../utils/helpers";
import ElectoratesTable from "../features/affiliate-voters/components/ElectoratesTable";
import BarangayFilterAll from "../ui/BarangayFilterAll";

const VotersGold = () => {
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(pagePermission, "voters_ato");
  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">{"GOLD AFFILIATE ID"}</Heading>
        <BarangayFilterAll />
      </Row>
      <hr className="border-t-1 border-gray-300" />
      <Row>
        <ElectoratesTable />
      </Row>
    </>
  );
};

export default VotersGold;
