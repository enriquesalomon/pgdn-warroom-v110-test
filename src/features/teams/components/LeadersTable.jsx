import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import { useElectoratesPer_Brgy2 } from "../../electorate/hooks/useElectorates";

import ElectoratesRow from "./ElectoratesRow";
import Search from "../../../ui/Search";
import { useState } from "react";
// import Pagination from "../../../ui/Pagination";
import { useDebounce } from "use-debounce";
import Row from "../../../ui/Row";
import Heading from "../../../ui/Heading";
import BarangayFilter from "../../../ui/BarangayFilter";
import PaginationTblModal from "../../../ui/PaginationTblModal";
import { useElectoratesForLeaders, useLeaders } from "../hooks/useTeams";
function LeadersTable({
  brgy,
  onSelectElectorate,
  onCloseModal,
  modal_target,
  type,
}) {
  const viewable_brgy = localStorage.getItem("viewable_brgy");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, electorates, count } = useLeaders(
    debouncedSearchTerm,
    type
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  let sortedElectorates = electorates;
  let leader_type;
  if (type === "gm") {
    leader_type = "Grand Master";
  }
  if (type === "agm") {
    leader_type = "Assistant Grand Master";
  }
  if (type === "legend") {
    leader_type = "Legend";
  }
  if (type === "elite") {
    leader_type = "Elite";
  }
  // if (isPending) return <Spinner />;
  return (
    <>
      <Row type="horizontal" className="mt-7">
        <Heading as="h2">Select {leader_type}</Heading>
        {/* <BarangayFilter viewable_brgy={viewable_brgy} /> */}
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
                    brgy={brgy}
                    modal_target={modal_target}
                    electorate={electorate}
                    key={electorate.id}
                    index={index}
                    onSelectElectorate={(electorate) => {
                      onSelectElectorate(electorate);
                      onCloseModal?.();
                    }}
                    // onSelectElectorate={(onSelectElectorate, close)}
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

export default LeadersTable;
