import TableOperations from "./TableOperations";
import SortBy4 from "./SortBy4";
import { format } from "date-fns";
function EventFilter({ events }) {
  console.log("---xx", JSON.stringify(events));
  // Check if events is defined and is an array
  const eventdata = [
    { value: "", label: "SELECT" },
    ...(Array.isArray(events)
      ? events.map((event) => ({
          value: event.id,
          label: `${event.title} - ${format(
            new Date(event.event_date),
            "MMM dd yyyy"
          )} - ${event.location}`,
        }))
      : []),
  ];

  return (
    <TableOperations>
      SELECT EVENT:
      <SortBy4 options={eventdata} />
    </TableOperations>
  );
}

export default EventFilter;
