import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import { useRef, useState } from "react";
import Search from "../../../ui/Search";
import Pagination from "../../../ui/Pagination";
import { useAttendees } from "../hooks/useAttendees";
import { useDebounce } from "use-debounce";
import { download, generateCsv, mkConfig } from "export-to-csv";
import Button from "../../../ui/Button";
import { SiMicrosoftexcel } from "react-icons/si";
import { useEffect } from "react";
import { barangayOptions } from "../../../utils/constants";
import { useSearchParams } from "react-router-dom";
import { insertLogs } from "../../../utils/recordUserActivity";
import { useQueryClient } from "@tanstack/react-query";
import SpinnerMini from "../../../ui/SpinnerMini";
import { useReactToPrint } from "react-to-print";
import { GrPrint } from "react-icons/gr";
import AttendeesRow from "./AttendeesRow";
import { format } from "date-fns";
import { convertTo12HourFormat } from "../../../utils/helpers";

function AttendeesTable({ events }) {
  console.log("Event Data: ", events);
  const componentRef = useRef(); // Ref to the component to print

  const allow_export = true;
  const [fetchAll, setFetchAll] = useState(false);

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

  useEffect(() => {
    if (allow_export) {
      setFetchAll(true);
    }
  }, [allow_export]);

  // const { all_data, isPending: isPending01 } = useFetchAllData(fetchAll);

  // const [exceldata, setExceldata] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, attendees, count } = useAttendees(debouncedSearchTerm);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);

  // Print handler using react-to-print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Attendees List",
  });

  return (
    <Menus>
      {/* <Search onChange={handleSearchChange} /> */}
      <div className="flex-row">
        <div className="w-full ">
          <Search
            width="106rem"
            terms={"Search Name"}
            onChange={handleSearchChange}
          />

          <Button onClick={handlePrint}>
            <div className="flex justify-center items-center">
              <GrPrint className="mr-2" />
              PRINT
            </div>
          </Button>
        </div>
      </div>
      <div className="mt-6" ref={componentRef}>
        {/* <Table columns="1fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1fr"> */}
        {/* Print Header */}
        <div className="flex-row mb-6">
          {/* Event Details */}
          {currentEvent ? (
            // <div className=" text-xl mb-4 border p-4 rounded bg-gray-50">
            //   <h2 className=" font-bold mb-2">Event Details</h2>
            //   <p>
            //     Title: <span className="font-medium">{currentEvent.title}</span>
            //   </p>
            //   <p>
            //     Description: <span>{currentEvent.description}</span>
            //   </p>
            //   <p>
            //     Date: <span>{}</span>{" "}
            //     <span>
            //       {format(new Date(currentEvent.event_date), "MMMM dd, yyyy")}
            //     </span>
            //   </p>
            //   <p>
            //     Start Time:{" "}
            //     <span>
            //       {convertTo12HourFormat(currentEvent.start_time) || "N/A"}
            //     </span>
            //   </p>
            //   <p>
            //     End Time:{" "}
            //     <span>
            //       {convertTo12HourFormat(currentEvent.end_time) || "N/A"}
            //     </span>
            //   </p>
            //   <p>
            //     Venue: <span>{currentEvent.location}</span>
            //   </p>
            // </div>
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
          {/* <p>Validation: {new Date().toLocaleDateString()}</p> */}
        </div>

        <Table columns="1fr 2fr 3.5fr 1.8fr 2fr 3fr">
          <Table.Header>
            <div>#</div>
            <div>Precinct No.</div>
            <div>Name</div>
            <div>Barangay</div>
            <div>Purok</div>
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
