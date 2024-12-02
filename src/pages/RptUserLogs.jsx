import React from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import UserLogsTable from "../features/reports/rpt_UserLogs/components/LogsTable";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { parsePage } from "../utils/helpers";

const RptUserLogs = () => {
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(pagePermission, "rpt_ulogs");
  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">USER LOGS</Heading>
        {/* <ServicesTableOperations /> */}
      </Row>
      <hr className="border-t-1 border-gray-300" />
      <div className="pt-4 min-h-screen">
        <UserLogsTable />
      </div>
    </>
  );
};

export default RptUserLogs;
