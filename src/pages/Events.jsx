import Heading from "../ui/Heading";
import Row from "../ui/Row";
import AddBeneficiary from "../features/services/components/AddBeneficiary";
import ServiceTable from "../features/services/components/ServiceTable";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { useActionPermissionContext } from "../context/ActionPermissionContext";
import { parseAction, parsePage } from "../utils/helpers";

const Events = () => {
  // const viewable_brgy = localStorage.getItem("viewable_brgy");
  const { pagePermission } = usePagePermissionContext();

  const isAllowed = parsePage(pagePermission, "services");

  const { actionPermission } = useActionPermissionContext();
  const isAllowedAction = parseAction(actionPermission, "add services");

  if (!isAllowed) {
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">Event Manager</Heading>
        {/* <BarangayFilter viewable_brgy={viewable_brgy} /> */}
      </Row>
      <hr className="border-t-1 border-gray-300" />
      <Row>
        {/* {isAllowedAction ? <AddBeneficiary /> : null}
        <ServiceTable /> */}
      </Row>
    </>
  );
};

export default Events;
