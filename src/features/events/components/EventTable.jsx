import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import { useEvent } from "../hooks/useEvent";
import AddEvent from "./AddEvent";
import Pagination from "../../../ui/Pagination";
import EventRow from "./EventRow";

function EventTable() {
  const { isPending, events, count } = useEvent();

  return (
    <Menus>
      <div className="flex-row">
        <div className="w-full ">
          <AddEvent />
        </div>
      </div>

      <Table columns="1fr 1fr 1fr 1fr  1fr 1fr 1fr 1fr 1fr">
        <Table.Header>
          <div>ID</div>
          <div>Event Type</div>
          <div>Title</div>
          <div>Description</div>
          <div>Details</div>
          <div>QR Use</div>
        </Table.Header>
        {isPending ? (
          <Spinner />
        ) : (
          <>
            <Table.Body
              data={events}
              render={(events, index) => (
                <EventRow events={events} key={events.id} index={index} />
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

export default EventTable;
