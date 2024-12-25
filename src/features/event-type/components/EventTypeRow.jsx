import EvenTypeForm from "./EvenTypeForm";
import { HiPencil, HiTrash } from "react-icons/hi2";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import { useActionPermissionContext } from "../../../context/ActionPermissionContext";
import Tag from "../../../ui/Tag";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../utils/recordUserActivity";
import { parseAction } from "../../../utils/helpers";
import { format } from "date-fns";
import { useDeleteEventType } from "../hooks/useDeleteEventType";

function EventTypeRow({ eventtype, index }) {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const { actionPermission } = useActionPermissionContext();
  const { isDeleting, deleteSector } = useDeleteEventType();
  const isAllowedAction = parseAction(actionPermission, "delete baco");
  const { id, type_name, description } = eventtype;

  return (
    <Table.Row>
      <div>{id}</div>
      <div>{type_name}</div>
      <div>{description}</div>
      <div></div>
      {/* <div>{name}</div>
      <div>{format(new Date(created_at), "MMM dd yyyy  hh:mm:ss a")}</div> */}

      {/* <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={sectorID} />

            <Menus.List id={sectorID}>
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              {isAllowedAction ? (
                <Modal.Open opens="delete">
                  <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                </Modal.Open>
              ) : null}
            </Menus.List>

            <Modal.Window name="edit" heightvar="35%">
              <PrecinctForm sectorToEdit={sector} />
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                message={`Are you sure you want to permanently delete this sector.? `}
                recordof={name}
                resourceName="sector"
                disabled={isDeleting}
                onConfirm={() => {
                  deleteSector(sectorID);
                  const params = {
                    page: "Settings (Sector)",
                    action: "User deleted a Sector",
                    parameters: { name: name },
                    user_id: userData.id,
                  };
                  insertLogs(params);
                }}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div> */}
    </Table.Row>
  );
}

export default EventTypeRow;
