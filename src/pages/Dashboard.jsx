import DashboardLayout from "../features/dashboard/components/DashboardLayout";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { parsePage } from "../utils/helpers";

function Dashboard() {
  const { pagePermission } = usePagePermissionContext();
  const isDashboardAllowed = parsePage(pagePermission, "dashboard");

  // Conditional rendering based on the value of isDashboardAllowed
  if (!isDashboardAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Authorized Access" />;
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">DASHBOARD</Heading>
      </Row>
      <hr className="border-t-1 border-gray-300" />
      <DashboardLayout />
    </>
  );
}

export default Dashboard;
