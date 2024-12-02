import AssTypeForm from "./AssTypeForm";
import { HiPencil, HiTrash } from "react-icons/hi2";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import { useActionPermissionContext } from "../../../context/ActionPermissionContext";
import Tag from "../../../ui/Tag";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../utils/recordUserActivity";
import { useDeleteAssType } from "../hooks/useDeleteAssType";
import { parseAction } from "../../../utils/helpers";
import { format } from "date-fns";

function AssTypeRow({ asstype, index }) {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const { actionPermission } = useActionPermissionContext();
  const { isDeleting, deleteAssType } = useDeleteAssType();
  const { id: sectorID, name, created_at } = asstype;

  return (
    <Table.Row>
      <div>{name}</div>
      <div>{format(new Date(created_at), "MMM dd yyyy  hh:mm:ss a")}</div>

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={sectorID} />

            <Menus.List id={sectorID}>
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit" heightvar="35%">
              <AssTypeForm asstypeToEdit={asstype} />
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                message={`Are you sure you want to permanently delete this assistance type.? `}
                recordof={name}
                resourceName="assistance type"
                disabled={isDeleting}
                onConfirm={() => {
                  deleteAssType(sectorID);
                  const params = {
                    page: "Settings (Assistance Type)",
                    action: "User deleted an Assistance Type",
                    parameters: { name: name },
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

export default AssTypeRow;
