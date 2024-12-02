import DashboardLayout from "../features/voters-monitoring/components/DashboardLayout";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { parsePage } from "../utils/helpers";

function VotersMonitoring() {
  const { pagePermission } = usePagePermissionContext();
  const isDashboardAllowed = parsePage(pagePermission, "voters_monitoring");
  // let isDashboardAllowed = pagePermission.includes("dashboard");
  // if (!isDashboardAllowed) {
  //   isDashboardAllowed = decryptData(pagePermission);
  //   const decrypted_page_permission = decryptData(pagePermission);
  //   isDashboardAllowed = decrypted_page_permission.includes("dashboard");
  // }

  // Conditional rendering based on the value of isDashboardAllowed
  if (!isDashboardAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Authorized Access" />;
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">VOTERS MONITORING</Heading>
        {/* <DashboardFilter /> */}
      </Row>
      <hr className="border-t-1 border-gray-300" />
      <DashboardLayout />
    </>
  );
}

export default VotersMonitoring;
