import Heading from "../ui/Heading";
import Row from "../ui/Row";
import EventTable from "../features/events/components/EventTable";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { useActionPermissionContext } from "../context/ActionPermissionContext";
import { parseAction, parsePage } from "../utils/helpers";
// import AddEvent from "../features/event/components/AddEvent";

const Events = () => {
  // const viewable_brgy = localStorage.getItem("viewable_brgy");
  const { pagePermission } = usePagePermissionContext();

  const isAllowed = parsePage(pagePermission, "events");

  const { actionPermission } = useActionPermissionContext();
  const isAllowedAction = parseAction(actionPermission, "add event");

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
        {/* {isAllowedAction ? <AddEvent /> : null}*/}
        <EventTable />
      </Row>
    </>
  );
};

export default Events;
