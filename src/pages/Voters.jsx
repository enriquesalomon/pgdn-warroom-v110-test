import React from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { parsePage } from "../utils/helpers";
import ElectoratesTable from "../features/organized-voters/components/ElectoratesTable";
import BarangayFilterAll from "../ui/BarangayFilterAll";
import ListFilter from "../features/organized-voters/components/ListFilter";
import ListFilter2 from "../features/organized-voters/components/ListFilter2";
import ListFilter3 from "../features/organized-voters/components/ListFilter3";

const Voters = () => {
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(pagePermission, "voters_ato");
  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <Row type="horizontal">
        {/* <Heading as="h2">{"ORGANIZED VOTERS (ATO)"}</Heading> */}
        <Heading as="h2">{"LIST OF ELECTORATES ASENSO ID"}</Heading>
        <BarangayFilterAll />
      </Row>
      <hr className="border-t-1 border-gray-300" />
      {/* <Row type="horizontal">
        <div></div>
      </Row> */}
      <Row type="horizontal">
        <ListFilter /> <ListFilter2 /> <ListFilter3 />
      </Row>

      <Row>
        <ElectoratesTable />
      </Row>
    </>
  );
};

export default Voters;
