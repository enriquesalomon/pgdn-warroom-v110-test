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
import { useElectoratesPer_Brgy2 } from "../hooks/useServices";
import { useReactToPrint } from "react-to-print";

function ElectoratesTable({ onSelectElectorate, onCloseModal }) {
  const viewable_brgy = localStorage.getItem("viewable_brgy");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, electorates, count } =
    useElectoratesPer_Brgy2(debouncedSearchTerm);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  let sortedElectorates = electorates;

  // if (isPending) return <Spinner />;
  return (
    <>
      <Row type="horizontal" className="mt-7">
        <Heading as="h2">Search Electorates</Heading>
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

export default ElectoratesTable;
