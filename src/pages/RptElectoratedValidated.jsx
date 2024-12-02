import React from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
// import ElectorateValidatedTable from "../features/reports/rpt_ElectorateValidated/components/ElectorateValidatedTable";
import ValidationFilter from "../features/reports/rpt_ElectorateValidated/components/ValidationFilter";
import { parsePage } from "../utils/helpers";
import ElectorateValidatedTable from "../features/reports/rpt_ElectorateValidated/components/ElectorateValidatedTable";
import BarangayFilter from "../ui/BarangayFilter";
// import ElectoratesTableOperations from "../features/reports/rpt_ElectorateValidated/components/ElectoratesTableOperations";

const RptElectoratedValidated = () => {
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(pagePermission, "rpt_electorate_validated");
  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Electorate Validated</Heading>
        <ValidationFilter />
      </Row>
      <Row type="horizontal">
        <div></div>
        <BarangayFilter />
      </Row>

      <div className="pt-4 min-h-screen">
        {/* <ElectorateValidatedTable /> */}
        <ElectorateValidatedTable />
      </div>
    </>
  );
};

export default RptElectoratedValidated;
