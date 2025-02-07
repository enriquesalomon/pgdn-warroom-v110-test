import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
// import { useElectorates_forBaco } from "../../electorate/hooks/useElectorates";

import ElectoratesRow from "./ElectoratesRow";
import Search from "../../../ui/Search";
import { useState } from "react";
import Pagination from "../../../ui/Pagination";
import { useDebounce } from "use-debounce";
import Row from "../../../ui/Row";
import Heading from "../../../ui/Heading";
import BarangayFilterAll from "../../../ui/BarangayFilterAll";
import { useElectorates_forBaco } from "../hooks/useBaco";

function ElectoratesTable({ onSelectElectorate, onCloseModal }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, electorates, count } =
    useElectorates_forBaco(debouncedSearchTerm);
  console.log("baocssss", count);
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  let sortedElectorates = electorates;

  // if (isPending) return <Spinner />;
  return (
    <>
      <Row type="horizontal" className="mt-7">
        <Heading as="h1">Search Electorates</Heading>
        <BarangayFilterAll />
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
                <Pagination count={count} />
              </Table.Footer>
            </>
          )}
        </Table>
      </Menus>
    </>
  );
}

export default ElectoratesTable;
