import React from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { parsePage } from "../utils/helpers";
import BarangayFilterAll from "../ui/BarangayFilterAll";
import ElectorateValidatedTable from "../features/reports/rpt_NonTeamClassification/components/ElectorateValidatedTable";
import ListFilter from "../features/reports/rpt_NonTeamClassification/components/ListFilter";
// import DashboardFilter from "../features/kamada-old/components/DashboardFilter";
import ValidationFilter from "../features/reports/rpt_NonTeamClassification/components/ValidationFilter";

const RptNonTeamClassification = () => {
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(pagePermission, "rpt_electorate_classification");
  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">
          NON-TEAM VALIDATION REPORT
          {/* <span className="italic text-3xl font-light">
            {"  Leader & Warriors List"}
          </span> */}
        </Heading>

        <BarangayFilterAll />
      </Row>
      <hr className="border-t-1 border-gray-300" />
      <Row type="horizontal">
        <div></div>
        {/* <ListFilter /> */}
        <ValidationFilter />
      </Row>
      <Row type="horizontal">
        <div></div>
        <ListFilter />
      </Row>

      <div className="pt-4 min-h-screen">
        <ElectorateValidatedTable />
      </div>
    </>
  );
};

export default RptNonTeamClassification;
