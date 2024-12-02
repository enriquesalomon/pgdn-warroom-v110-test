import React from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { parsePage } from "../utils/helpers";
import BarangayFilterAll from "../ui/BarangayFilterAll";
import ElectorateTable from "../features/reports/rpt_TeamList/components/ElectorateTable";

const RptTeamList = () => {
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(pagePermission, "rpt_team_list");
  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">LIST OF TEAM</Heading>
        <BarangayFilterAll />
      </Row>
      <hr className="border-t-1 border-gray-300" />
      {/* <Row type="horizontal">
        <div></div>
        <ListFilter />
      </Row> */}

      <div className="pt-4 min-h-screen">
        {/* <ElectorateValidatedTable /> */}
        <ElectorateTable />
      </div>
    </>
  );
};

export default RptTeamList;
