import { HiPencil, HiTrash } from "react-icons/hi2";
import Modal from "../../../ui/Modal";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import { useDeleteAttendees } from "../hooks/useDeleteAttendees";
import { useActionPermissionContext } from "../../../context/ActionPermissionContext";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../utils/recordUserActivity";
import { parseAction } from "../../../utils/helpers";

function AttendeesRow({ attendees, index, debouncedSearchTerm }) {
  const queryClient = useQueryClient();
  const { actionPermission } = useActionPermissionContext();
  const { isDeleting, deleteAttendees } =
    useDeleteAttendees(debouncedSearchTerm);
  const isAllowedAction = parseAction(
    actionPermission,
    "add/remove event attendees"
  );

  const userData = queryClient.getQueryData(["user"]);

  const {
    id: attendeesId,
    precinctno,
    lastname,
    firstname,
    middlename,
    brgy,
    purok,
  } = attendees;
  return (
    <Table.Row>
      <div>{index + 1}</div>
      <div>{precinctno}</div>
      <div>
        {lastname}, {firstname} {middlename}
      </div>
      <div>{brgy}</div>
      <div>{purok}</div>
      <div className="no-print">
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={attendeesId} />

            <Menus.List id={attendeesId}>
              {isAllowedAction && (
                <Modal.Open opens="delete">
                  <Menus.Button icon={<HiTrash />}>Remove</Menus.Button>
                </Modal.Open>
              )}
            </Menus.List>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="event attendees"
                disabled={isDeleting}
                onConfirm={() => {
                  deleteAttendees(attendeesId);
                  const params = {
                    page: "Event Attendees",
                    action: "User remove an event attendees",
                    user_id: userData.id,
                  };
                  insertLogs(params);
                }}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default AttendeesRow;
