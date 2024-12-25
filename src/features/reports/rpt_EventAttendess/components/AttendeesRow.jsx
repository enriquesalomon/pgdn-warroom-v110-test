import { HiPencil, HiTrash } from "react-icons/hi2";
import Modal from "../../../../ui/Modal";
import Table from "../../../../ui/Table";
import Menus from "../../../../ui/Menus";
import { useActionPermissionContext } from "../../../../context/ActionPermissionContext";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../../utils/recordUserActivity";
import { parseAction } from "../../../../utils/helpers";

function AttendeesRow({ attendees, index, debouncedSearchTerm }) {
  const queryClient = useQueryClient();
  const { actionPermission } = useActionPermissionContext();

  const userData = queryClient.getQueryData(["user"]);

  const {
    id: attendeesId,
    precinctno,
    lastname,
    firstname,
    middlename,
    brgy,
    purok,
    is_checked_in,
    check_in_time,
    description,
  } = attendees;
  return (
    <Table.Row>
      <div>{index + 1}</div>
      <div>{precinctno}</div>
      <div>
        {lastname}, {firstname} {middlename},
      </div>
      <div>{brgy}</div>
      <div>{purok}</div>
      <div>{check_in_time}</div>
      <div className="truncate max-w-lg">{description}</div>
    </Table.Row>
  );
}

export default AttendeesRow;
