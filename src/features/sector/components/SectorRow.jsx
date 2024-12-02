import SectorForm from "./SectorForm";
import { HiPencil, HiTrash } from "react-icons/hi2";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import { useActionPermissionContext } from "../../../context/ActionPermissionContext";
import Tag from "../../../ui/Tag";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../utils/recordUserActivity";
import { useDeleteSector } from "../hooks/useDeleteSector";
import { parseAction } from "../../../utils/helpers";
import { format } from "date-fns";

function SectorRow({ sector, index }) {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const { actionPermission } = useActionPermissionContext();
  const { isDeleting, deleteSector } = useDeleteSector();
  const isAllowedAction = parseAction(actionPermission, "delete baco");
  const { id: sectorID, name, created_at } = sector;

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

              {isAllowedAction ? (
                <Modal.Open opens="delete">
                  <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                </Modal.Open>
              ) : null}
            </Menus.List>

            <Modal.Window name="edit" heightvar="35%">
              <SectorForm sectorToEdit={sector} />
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
      </div>
    </Table.Row>
  );
}

export default SectorRow;
