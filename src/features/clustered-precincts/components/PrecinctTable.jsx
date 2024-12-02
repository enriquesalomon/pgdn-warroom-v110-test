import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import { usePrecinct } from "../hooks/usePrecinct";
import PrecinctRow from "./PrecinctRow";
import Pagination from "../../../ui/Pagination";
import AddPrecinct from "./AddPrecinct";

function PrecinctTable() {
  const { isPending, precinct, count } = usePrecinct();
  console.log("asdasdasd", count);
  return (
    <Menus>
      {/* <div className="flex-row">
        <div className="w-full ">
          <AddPrecinct />
        </div>
      </div> */}

      <Table columns="1fr 1fr 1fr 1fr 1fr">
        <Table.Header>
          <div>ID</div>
          <div>Barangay</div>
          <div>Cluster No.</div>
          <div>Precinct</div>
        </Table.Header>
        {isPending ? (
          <Spinner />
        ) : (
          <>
            <Table.Body
              data={precinct}
              render={(precinct, index) => (
                <PrecinctRow
                  precinct={precinct}
                  key={precinct.id}
                  index={index}
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
  );
}

export default PrecinctTable;
