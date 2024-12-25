import Heading from "../ui/Heading";
import Row from "../ui/Row";
import AddBeneficiary from "../features/services/components/AddBeneficiary";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { useActionPermissionContext } from "../context/ActionPermissionContext";
import { parseAction, parsePage } from "../utils/helpers";
import AttendeesTable from "../features/event-attendees/components/AttendeesTable";
import EventFilter from "../ui/EventFilter";
import { useEvents } from "../features/event-attendees/hooks/useEvents";
import AddAttendees from "../features/event-attendees/components/AddAttendees";
import { useSearchParams } from "react-router-dom";

const EventAttendees = () => {
  const { isPending, events, count } = useEvents();
  const viewable_brgy = localStorage.getItem("viewable_brgy");

  const { pagePermission } = usePagePermissionContext();

  const isAllowed = parsePage(pagePermission, "services");

  const { actionPermission } = useActionPermissionContext();
  const isAllowedAction = parseAction(
    actionPermission,
    "add/remove event attendees"
  );
  const [searchParams] = useSearchParams();
  const event = searchParams.get("event");

  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">EVENT ATTENDEES</Heading>
        <EventFilter events={events?.data} />
      </Row>
      <hr className="border-t-1 border-gray-300" />
      <Row>
        {isAllowedAction && event ? <AddAttendees /> : null}
        <AttendeesTable events={events?.data} />
      </Row>
    </>
  );
};

export default EventAttendees;
