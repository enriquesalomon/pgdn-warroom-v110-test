import React from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { parsePage } from "../utils/helpers";
import BarangayFilterAll from "../ui/BarangayFilterAll";
import ElectorateTable from "../features/reports/rpt_ElectorateClassification/components/ElectorateTable";
import ListFilter from "../features/reports/rpt_ElectorateClassification/components/ListFilter";

const RptElectorateClassification = () => {
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(
    pagePermission,
    "rpt_electorate_team_assignments"
  );
  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">
          ELECTORATE CLASSIFICATION
          <span className="italic text-3xl font-light">
            {"  Tower & Warriors List"}
          </span>
        </Heading>

        <BarangayFilterAll />
      </Row>
      <hr className="border-t-1 border-gray-300" />
      <Row type="horizontal">
        <div></div>
        <ListFilter />
      </Row>

      <div className="pt-4 min-h-screen">
        {/* <ElectorateValidatedTable /> */}
        <ElectorateTable />
      </div>
    </>
  );
};

export default RptElectorateClassification;
