import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import { useEventType } from "../hooks/useEventType";
import AddEvenType from "./AddEvenType";
import Pagination from "../../../ui/Pagination";
import EventTypeRow from "./EventTypeRow";

function EventTypeTable() {
  const { isPending, eventtype, count } = useEventType();
  console.log("asdasdasd", count);
  return (
    <Menus>
      <div className="flex-row">
        <div className="w-full ">
          <AddEvenType />
        </div>
      </div>

      <Table columns="1fr 1fr 1fr 1fr">
        <Table.Header>
          <div>ID</div>
          <div>Name</div>
          <div>Description</div>
        </Table.Header>
        {isPending ? (
          <Spinner />
        ) : (
          <>
            <Table.Body
              data={eventtype}
              render={(eventtype, index) => (
                <EventTypeRow
                  eventtype={eventtype}
                  key={eventtype.id}
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

export default EventTypeTable;
