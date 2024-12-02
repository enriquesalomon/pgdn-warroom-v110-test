import BacoForm from "./BacoForm";
import {
  HiOutlineUserMinus,
  HiOutlineUserPlus,
  HiPencil,
  HiTrash,
} from "react-icons/hi2";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import { useActionPermissionContext } from "../../../context/ActionPermissionContext";
import Tag from "../../../ui/Tag";
import ConfirmActivate from "../../../ui/ConfirmActivate";
import ConfirmDeactivate from "../../../ui/ConfirmDeactivate";
import { useActivateBaco } from "../hooks/useActivateBaco";
import { useDeactivateBaco } from "../hooks/useDeactivateBaco";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../utils/recordUserActivity";
import { useDeleteBaco } from "../hooks/useDeleteBaco";
import { parseAction } from "../../../utils/helpers";

function BacoRow({ electorate, index, searchText }) {
  console.log("searchTerm---", searchText);
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const { isDeactivating, deactivateBaco } = useDeactivateBaco();
  const { isActivating, activateBaco } = useActivateBaco();
  const { actionPermission } = useActionPermissionContext();
  const { isDeleting, deleteBaco } = useDeleteBaco();
  // const isAllowedAction = parseAction(actionPermission, "delete baco");
  const {
    id: electorateId,
    lastname,
    firstname,
    middlename,
    gender,
    contactno,
    brgy,
    status,
    added_by,
    electorate_id,
  } = electorate;

  return (
    <Table.Row>
      <div>
        {lastname}, {firstname} {middlename}
      </div>
      <div>{gender}</div>
      <div>{contactno}</div>
      <div>{brgy}</div>
      <div>{added_by}</div>
      {status === "active" && <Tag type="green">Active</Tag>}
      {status === "inactive" && <Tag type="red">Inactive</Tag>}
      {status === null && <Tag></Tag>}

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={electorateId} />

            <Menus.List id={electorateId}>
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              {/* {isAllowedAction ? (
                <Modal.Open opens="delete">
                  <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                </Modal.Open>
              ) : null} */}

              {status !== "active" ? (
                <Modal.Open opens="activate">
                  <Menus.Button icon={<HiOutlineUserPlus />}>
                    Activate
                  </Menus.Button>
                </Modal.Open>
              ) : (
                <Modal.Open opens="deactivate">
                  <Menus.Button icon={<HiOutlineUserMinus />}>
                    Deactivate
                  </Menus.Button>
                </Modal.Open>
              )}
            </Menus.List>

            <Modal.Window name="edit" heightvar="90%">
              <BacoForm searchText={searchText} electorateToEdit={electorate} />
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                message={`Are you sure you want to permanently delete this team.? `}
                recordof={`BACO: ${firstname + " " + lastname}`}
                message2={`Existing related records of this baco user account will also be deleted. This action cannot be undone.`}
                resourceName="baco"
                disabled={isDeleting}
                onConfirm={() =>
                  deleteBaco({ id: electorateId, electorate_id: electorate_id })
                }
              />
            </Modal.Window>

            <Modal.Window name="activate">
              <ConfirmActivate
                resourceName="baco"
                disabled={isActivating}
                onConfirm={() => {
                  activateBaco(electorateId);
                  const params = {
                    page: "Baco",
                    action: "User activated a Baco",
                    parameters: { Baco_id: electorateId },
                    user_id: userData.id,
                  };
                  insertLogs(params);
                }}
              />
            </Modal.Window>

            <Modal.Window name="deactivate">
              <ConfirmDeactivate
                resourceName="baco"
                disabled={isDeactivating}
                onConfirm={() => {
                  deactivateBaco(electorateId);
                  const params = {
                    page: "Baco",
                    action: "User deactivated a Baco",
                    parameters: { Baco_id: electorateId },
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

export default BacoRow;
