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

      <Table columns="1fr 1.5fr 1.5fr 1.8fr  1fr 2.5fr 1fr 0.5fr 0.5fr">
        <Table.Header>
          <div>ID</div>
          <div>Event Type</div>
          <div>Title</div>
          <div>Description</div>
          <div>QR Use</div>
          <div>Details</div>
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
