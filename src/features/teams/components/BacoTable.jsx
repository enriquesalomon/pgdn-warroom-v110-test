import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";

import Search from "../../../ui/Search";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import Row from "../../../ui/Row";
import Heading from "../../../ui/Heading";
import PaginationTblModal from "../../../ui/PaginationTblModal";
import BacoRow from "./BacoRow";
import { useBaco } from "../hooks/useBaco";
function BacoTable({ brgy, onSelectElectorate, onCloseModal, modal_target }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  // const { isPending, electorates, count } =
  //   useElectoratesForLeaders(debouncedSearchTerm);
  const { isPending, electorates, count } = useBaco(debouncedSearchTerm);
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  let sortedElectorates = electorates;
  // if (isPending) return <Spinner />;
  return (
    <>
      <Row type="horizontal" className="mt-7">
        <Heading as="h2">Select Baco</Heading>
      </Row>

      <Menus>
        <div className="flex-row mt-7">
          <div className="w-full">
            <Search value={searchTerm} onChange={handleSearchChange} />
          </div>
        </div>

        <Table columns="2.5fr 1fr 1fr 1.8fr 1.8fr 1fr  1fr 1fr">
          <Table.Header>
            <div>Name</div>
            <div>Gender</div>
            <div>Contact#</div>
            <div>Brgy</div>
            <div>Created By</div>
            <div>Status</div>
            <div></div>
          </Table.Header>
          {isPending ? (
            <Spinner />
          ) : (
            <>
              <Table.Body
                data={sortedElectorates}
                render={(electorate, index) => (
                  <BacoRow
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

export default BacoTable;
