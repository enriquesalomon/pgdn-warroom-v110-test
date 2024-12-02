import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import { useAssType } from "../hooks/useAssType";
import AssTypeRow from "./AssTypeRow";
import Pagination from "../../../ui/Pagination";
import AddAssType from "./AddAssType";

function AssTypeTable() {
  const { isPending, asstype, count } = useAssType();

  return (
    <Menus>
      <div className="flex-row">
        <div className="w-full ">
          <AddAssType />
        </div>
      </div>

      <Table columns="1fr 1fr 1fr">
        <Table.Header>
          <div>Assistance Type</div>
          <div>Created At</div>
          <div></div>
        </Table.Header>
        {isPending ? (
          <Spinner />
        ) : (
          <>
            <Table.Body
              data={asstype}
              render={(asstype, index) => (
                <AssTypeRow asstype={asstype} key={asstype.id} index={index} />
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

export default AssTypeTable;
