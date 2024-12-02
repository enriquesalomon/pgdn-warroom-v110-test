import {
  HiPencil,
  HiOutlineUserPlus,
  HiOutlineUserMinus,
} from "react-icons/hi2";
import Modal from "../../../../ui/Modal";
import ConfirmActivate from "../../../../ui/ConfirmActivate";
import ConfirmDeactivate from "../../../../ui/ConfirmDeactivate";
import Table from "../../../../ui/Table";
import Menus from "../../../../ui/Menus";
import { useDeactivateUser } from "../hooks/useDeactivateUser";
import { useActivateUser } from "../hooks/useActivateUser";
import SignupForm from "./SignupForm";
import Tag from "../../../../ui/Tag";
import { useActionPermissionContext } from "../../../../context/ActionPermissionContext";
import { useTeams } from "../../../teams/hooks/useTeamSearchAll";
import { useState } from "react";
import { useUser } from "../../../authentication/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../../utils/recordUserActivity";
import { parseAction } from "../../../../utils/helpers";

function UserRow({ users }) {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const { user: usersauth } = useUser();
  const { actionPermission } = useActionPermissionContext();
  const isAllowedAction = parseAction(
    actionPermission,
    "activation/deactivation user"
  );
  const { isDeactivating, deactivateUser } = useDeactivateUser();
  const { isActivating, activateUser } = useActivateUser();
  const { teams } = useTeams();
  const [isAppUser, setIsAppUser] = useState(false);
  const handleAccessTypeChange = (accountrole) => {
    // Check if the accesstype is "App User"
    setIsAppUser(accountrole === "Validator");
  };
  const {
    id: userId,
    fullname,
    email,
    contactno,
    accesstype,
    account_role,
    is_active,
    createdby,
  } = users;
  const shouldRenderEditButton =
    account_role !== "Super Admin" || userId === usersauth.id;

  return (
    <Table.Row>
      {/* <Leader>{fullname}</Leader> */}
      <div>{fullname}</div>
      <div>{email}</div>
      <div>{contactno}</div>
      <div>{accesstype}</div>
      <div>{account_role}</div>
      <div>{createdby}</div>
      {is_active === "active" && <Tag type="green">Active</Tag>}
      {is_active === "inactive" && <Tag type="red">Inactive</Tag>}
      {is_active === null && <Tag></Tag>}
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={userId} />

            <Menus.List id={userId}>
              {shouldRenderEditButton && (
                <Modal.Open opens="edit">
                  <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
                </Modal.Open>
              )}

              {isAllowedAction &&
                shouldRenderEditButton &&
                (is_active !== "active" ? (
                  <Modal.Open opens="activate">
                    <Menus.Button icon={<HiOutlineUserPlus />}>
                      Activate
                    </Menus.Button>
                  </Modal.Open>
                ) : (
                  <Modal.Open opens="deactivate">
                    <Menus.Button icon={<HiOutlineUserMinus />}>
                      Deactive
                    </Menus.Button>
                  </Modal.Open>
                ))}
            </Menus.List>

            <Modal.Window
              backdrop={true}
              name="edit"
              heightvar={isAppUser ? "65%" : "100%"}
            >
              <SignupForm
                userToEdit={users}
                teams={teams}
                onChangeAccessType={handleAccessTypeChange}
              />
            </Modal.Window>

            <Modal.Window name="activate">
              <ConfirmActivate
                resourceName="user"
                disabled={isActivating}
                onConfirm={() => {
                  activateUser(userId);
                  const params = {
                    page: "Users",
                    action: "User activate an account",
                    parameters: userId,
                    user_id: userData.id,
                  };
                  insertLogs(params);
                }}
              />
            </Modal.Window>
            <Modal.Window name="deactivate">
              <ConfirmDeactivate
                resourceName="user"
                disabled={isDeactivating}
                // onConfirm={() => deactivateUser(userId)}
                onConfirm={() => {
                  deactivateUser(userId);
                  const params = {
                    page: "Users",
                    action: "User deactivate an account",
                    parameters: userId,
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

export default UserRow;
