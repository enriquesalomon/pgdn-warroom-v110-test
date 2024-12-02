import LeaderForm from "./LeaderForm";
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
import { useActivateLeader } from "../hooks/useActivateLeader";
import { useDeactivateLeader } from "../hooks/useDeactivateLeader";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../utils/recordUserActivity";
import { useDeleteLeader } from "../hooks/useDeleteLeader";
import { parseAction } from "../../../utils/helpers";
import LeadersTable from "./LeadersTable";

function LeaderRow({ electorate, index }) {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const { isDeactivating, deactivateLeader } = useDeactivateLeader();
  const { isActivating, activateLeader } = useActivateLeader();
  const { actionPermission } = useActionPermissionContext();
  const { isDeleting, deleteLeader } = useDeleteLeader();
  const isAllowedAction = parseAction(actionPermission, "delete baco");
  const {
    id,
    lastname,
    firstname,
    middlename,
    gender,
    contactno,
    brgy,
    status,
    added_by,
    leader_type,
    electorate_id,
    precinctno,
  } = electorate;

  return (
    <Table.Row>
      <div>
        {lastname}, {firstname} {middlename}
      </div>
      <div>{precinctno}</div>
      <div>{leader_type}</div>
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
            <Menus.Toggle id={id} />

            <Menus.List id={id}>
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              {isAllowedAction ? (
                <Modal.Open opens="delete">
                  <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                </Modal.Open>
              ) : null}

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
              <LeaderForm electorateToEdit={electorate} />
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                message={`Are you sure you want to permanently delete this Leader.? `}
                recordof={`${leader_type + ": " + firstname + " " + lastname}`}
                message2={`Existing related records of this leader will also be deleted. This action cannot be undone.`}
                resourceName="leader"
                disabled={isDeleting}
                onConfirm={() => {
                  deleteLeader({
                    id: id,
                    electorate_id: electorate_id,
                  });
                }}
              />
            </Modal.Window>

            <Modal.Window name="activate">
              <ConfirmActivate
                resourceName="leader"
                disabled={isActivating}
                onConfirm={() => {
                  activateLeader(id);
                  const params = {
                    page: "Leader",
                    action: "User activated a Leader",
                    parameters: { Leader_id: id },
                    user_id: userData.id,
                  };
                  insertLogs(params);
                }}
              />
            </Modal.Window>

            <Modal.Window name="deactivate">
              <ConfirmDeactivate
                resourceName="leaders"
                disabled={isDeactivating}
                onConfirm={() => {
                  deactivateLeader(id);

                  const params = {
                    page: "Leaders",
                    action: "User deactivated a Leader",
                    parameters: { Baco_id: id },
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

export default LeaderRow;
