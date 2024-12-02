import Heading from "../ui/Heading";
import Row from "../ui/Row";
import AddBeneficiary from "../features/services/components/AddBeneficiary";
import ServiceTable from "../features/services/components/ServiceTable";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { useActionPermissionContext } from "../context/ActionPermissionContext";
import { parseAction, parsePage } from "../utils/helpers";
import BarangayFilter from "../ui/BarangayFilter";

const Services = () => {
  const viewable_brgy = localStorage.getItem("viewable_brgy");
  const { pagePermission } = usePagePermissionContext();

  const isAllowed = parsePage(pagePermission, "services");

  const { actionPermission } = useActionPermissionContext();
  const isAllowedAction = parseAction(actionPermission, "add services");

  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">SERVICE AVAILMENT</Heading>
        <BarangayFilter viewable_brgy={viewable_brgy} />
      </Row>
      <hr className="border-t-1 border-gray-300" />
      <Row>
        {isAllowedAction ? <AddBeneficiary /> : null}
        <ServiceTable />
      </Row>
    </>
  );
};

export default Services;
