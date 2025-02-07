import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
// import { useElectoratesPer_Brgy2 } from "../../electorate/hooks/useElectorates";

import ElectoratesRow from "./ElectoratesRow";
import Search from "../../../ui/Search";
import { useRef, useState } from "react";
// import Pagination from "../../../ui/Pagination";
import PaginationTblModal from "../../../ui/PaginationTblModal";
import { useDebounce } from "use-debounce";
import Row from "../../../ui/Row";
import Heading from "../../../ui/Heading";
import BarangayFilter from "../../../ui/BarangayFilter";
// import { useElectoratesPer_Brgy2 } from "../hooks/useAttendees";
import { useReactToPrint } from "react-to-print";
import supabase from "../../../services/supabase";
import { useSearchParams } from "react-router-dom";
import { useInvalidateQuery } from "../hooks/useInvalidateQuery";
import { useElectoratesPer_Brgy2 } from "../../electorate/hooks/useElectorates";

function ElectoratesTable({ onSelectElectorate, onCloseModal }) {
  const viewable_brgy = localStorage.getItem("viewable_brgy");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, electorates, count } =
    useElectoratesPer_Brgy2(debouncedSearchTerm);

  const [searchParams] = useSearchParams();
  const event_id = searchParams.get("event");
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const invalidateQueries = useInvalidateQuery(debouncedSearchTerm);
  const handleSelectElectorate = (electorate) => {
    // Display a confirmation dialog before proceeding
    const confirmed = window.confirm(
      `Are you sure you want to add ${electorate.firstname} ${electorate.lastname} as an attendee?`
    );

    if (confirmed) {
      // Add the electorate as an attendee (save to Supabase)
      saveToSupabase(electorate);
    }
  };

  const saveToSupabase = async (electorate, event) => {
    try {
      const { error } = await supabase
        .from("event_attendees") // Assuming you have an "event_attendees" table in Supabase
        .upsert(
          [
            {
              electorate_id: electorate.id,
              event_id: event_id, // Event ID, assuming it's available
              lastname: electorate.lastname,
              middlename: electorate.middlename,
              firstname: electorate.firstname,
              qr_code: electorate.qr_code,
              precinctno: electorate.precinctno,
              brgy: electorate.brgy,
              purok: electorate.purok,
            },
          ],
          {
            onConflict: ["electorate_id", "event_id"], // Ensure these are the correct columns in your unique constraint
          }
        ); // Specify the unique constraint for upsert

      // if (error) throw error;
      if (error) {
        throw error;
      } else {
        // setLoading(false);
        invalidateQueries();
        alert("Attendee added or updated successfully!");
      }
    } catch (error) {
      console.error("Error adding/updating attendee: ", error);
      alert("Failed to add/update attendee.");
    }
  };

  let sortedElectorates = electorates;

  // if (isPending) return <Spinner />;
  return (
    <>
      <Row type="horizontal" className="mt-7">
        <Heading as="h2">Search Attendees</Heading>
        <BarangayFilter viewable_brgy={viewable_brgy} />
      </Row>

      <Menus>
        <div className="flex-row mt-7">
          <div className="w-full">
            <Search value={searchTerm} onChange={handleSearchChange} />
          </div>
        </div>

        <Table columns="1fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1fr">
          <Table.Header>
            <div>#</div>
            <div>Precinct No.</div>
            <div>Lastname</div>
            <div>Firstname</div>
            <div>Middlename</div>
            <div>Purok</div>
            <div>Brgy</div>
            <div></div>
          </Table.Header>
          {isPending ? (
            <Spinner />
          ) : (
            <>
              <Table.Body
                data={sortedElectorates}
                render={(electorate, index) => (
                  <ElectoratesRow
                    electorate={electorate}
                    key={electorate.id}
                    index={index}
                    onSelectElectorate={() => {
                      handleSelectElectorate(electorate); // Call the updated handler
                      // onCloseModal?.();
                    }}
                    // onSelectElectorate={(electorate) => {
                    //   onSelectElectorate(electorate);
                    //   onCloseModal?.();
                    // }}
                  />
                )}
              />
              <Table.Footer>
                <PaginationTblModal count={count} />
              </Table.Footer>
            </>
          )}
        </Table>
      </Menus>
    </>
  );
}

export default ElectoratesTable;
