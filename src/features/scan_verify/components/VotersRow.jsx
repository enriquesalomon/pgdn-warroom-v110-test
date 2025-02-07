import { HiTrash } from "react-icons/hi2";
import Modal from "../../../ui/Modal";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import { useActionPermissionContext } from "../../../context/ActionPermissionContext";

import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../utils/recordUserActivity";
import { parseAction } from "../../../utils/helpers";
import ConfirmDelete from "../../../ui/ConfirmDelete";
// import { useUntagSpecial } from "../hooks/useEditSpecialElectorate";
import { format } from "date-fns";

function VotersRow({ electorate, index }) {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const { actionPermission } = useActionPermissionContext();
  const isAllowedAction = parseAction(
    actionPermission,
    "tag special electorate"
  );
  // const { isDeleting, untagSpecial } = useUntagSpecial();
  const {
    id,
    created_at,
    electorate_id,
    team_id,
    brgy,
    scanned_type,
    scanned_remarks,
    team,
    electorates,
    notes,
  } = electorate;
  console.log("eaesdadad", JSON.stringify(electorate));

  return (
    <Table.Row>
      <div>{id}</div>
      <div>
        <span>{format(new Date(created_at), "MMM dd yyyy  hh:mm:ss a")}</span>
      </div>
      <div>{scanned_type}</div>
      <div>{electorates?.precinctno}</div>
      <div>
        {electorates?.firstname} {electorates?.middlename}{" "}
        {electorates?.lastname}
      </div>

      <div>{electorates?.purok}</div>
      <div>{brgy}</div>
      {/* <div>{scanned_remarks}</div> */}
      <div>
        {team?.firstname} {team?.lastname}
      </div>

      {/* <div>{notes}</div> */}
    </Table.Row>
  );
}

export default VotersRow;
