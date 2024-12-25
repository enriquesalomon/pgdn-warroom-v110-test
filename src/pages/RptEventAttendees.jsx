import React from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { parsePage } from "../utils/helpers";
import AttendeesTable from "../features/reports/rpt_EventAttendess/components/AttendeesTable";
import EventFilter from "../ui/EventFilter";
import { useEvents } from "../features/event-attendees/hooks/useEvents";

const RptEventAttendees = () => {
  const { isPending, events, count } = useEvents();
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(pagePermission, "rpt_team_list");
  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">LIST OF EVENT ATTENDEES</Heading>
        <EventFilter events={events?.data} />
      </Row>
      <hr className="border-t-1 border-gray-300" />
      {/* <Row type="horizontal">
        <div></div>
        <ListFilter />
      </Row> */}

      <div className="pt-4 min-h-screen">
        {/* <ElectorateValidatedTable /> */}
        <AttendeesTable events={events?.data} />
      </div>
    </>
  );
};

export default RptEventAttendees;
