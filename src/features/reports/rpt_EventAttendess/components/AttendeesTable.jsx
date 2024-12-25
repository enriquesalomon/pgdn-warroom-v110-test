import Spinner from "../../../../ui/Spinner";
import Table from "../../../../ui/Table";
import Menus from "../../../../ui/Menus";
import { useRef, useState, useEffect } from "react";
import Search from "../../../../ui/Search";
import Pagination from "../../../../ui/Pagination";
import { useAttendees } from "../hooks/useAttendees";
import { useDebounce } from "use-debounce";
import Button from "../../../../ui/Button";
import { SiMicrosoftexcel } from "react-icons/si";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import SpinnerMini from "../../../../ui/SpinnerMini";
import { useReactToPrint } from "react-to-print";
import { GrPrint } from "react-icons/gr";
import AttendeesRow from "./AttendeesRow";
import { format } from "date-fns";
import { convertTo12HourFormat } from "../../../../utils/helpers";

function AttendeesTable({ events }) {
  console.log("Event Data: ", events);
  const componentRef = useRef();

  const allow_export = true;
  const [fetchAll, setFetchAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const { isPending, attendees, count } = useAttendees(debouncedSearchTerm);

  const [searchParams] = useSearchParams();
  const event_id = parseInt(searchParams.get("event")) || 0; // Extract event_id from URL

  const [currentEvent, setCurrentEvent] = useState(null);

  // Find the event details based on event_id
  useEffect(() => {
    if (events?.length) {
      const foundEvent = events.find((event) => event.id === event_id);
      setCurrentEvent(foundEvent || null);
    }
  }, [event_id, events]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Attendees List",
  });

  return (
    <Menus>
      <div className="flex-row">
        <div className="w-full">
          <Search
            width="106rem"
            terms={"Search Name, Assistance Type"}
            onChange={handleSearchChange}
          />
          <Button onClick={handlePrint}>
            <div className="flex justify-center items-center">
              <GrPrint className="mr-2" /> PRINT
            </div>
          </Button>
        </div>
      </div>

      <div className="mt-6" ref={componentRef}>
        <div className="flex-row mb-6">
          {/* Event Details */}
          {currentEvent ? (
            <div className="text-xl mb-4 border p-4 rounded bg-gray-50">
              <h2 className="font-bold mb-4">Event Details</h2>
              <div className="space-y-2">
                <div className="flex">
                  <div className="w-1/6 font-semibold">Title:</div>
                  <div className="w-3/4 font-medium">{currentEvent.title}</div>
                </div>
                <div className="flex">
                  <div className="w-1/6 font-semibold">Description:</div>
                  <div className="w-3/4">{currentEvent.description}</div>
                </div>
                <div className="flex">
                  <div className="w-1/6 font-semibold">Date:</div>
                  <div className="w-3/4">
                    {format(new Date(currentEvent.event_date), "MMMM dd, yyyy")}
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/6 font-semibold">Start Time:</div>
                  <div className="w-3/4">
                    {convertTo12HourFormat(currentEvent.start_time) || "N/A"}
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/6 font-semibold">End Time:</div>
                  <div className="w-3/4">
                    {convertTo12HourFormat(currentEvent.end_time) || "N/A"}
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/6 font-semibold">Venue:</div>
                  <div className="w-3/4">{currentEvent.location}</div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-red-500">Event not found.</p>
          )}
        </div>
        <div
          className="print-header"
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          <h1>List of Attendees</h1>
        </div>

        <Table columns="1fr 1fr 3.5fr 1.8fr 2fr 3fr">
          <Table.Header>
            <div>#</div>
            <div>Precinct No.</div>
            <div>Name</div>
            <div>Barangay</div>
            <div>Purok</div>
            <div>Check-in Time</div>
          </Table.Header>
          {isPending ? (
            <Spinner />
          ) : (
            <>
              <Table.Body
                data={attendees}
                render={(attendees, index) => (
                  <AttendeesRow
                    debouncedSearchTerm={debouncedSearchTerm}
                    attendees={attendees}
                    index={index}
                    key={attendees.id}
                  />
                )}
              />
              <Table.Footer>
                <Pagination count={count} />
              </Table.Footer>
            </>
          )}
        </Table>
      </div>
    </Menus>
  );
}

export default AttendeesTable;
