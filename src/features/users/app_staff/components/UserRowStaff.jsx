import {
  HiPencil,
  HiOutlineUserPlus,
  HiOutlineUserMinus,
} from "react-icons/hi2";
import { TbPasswordMobilePhone } from "react-icons/tb";
import Modal from "../../../../ui/Modal";
import ConfirmActivate from "../../../../ui/ConfirmActivate";
import ConfirmDeactivate from "../../../../ui/ConfirmDeactivate";
import Table from "../../../../ui/Table";
import Menus from "../../../../ui/Menus";
import { useDeactivateUser } from "../hooks/useDeactivateUser";
import { useActivateUser } from "../hooks/useActivateUser";
import Tag from "../../../../ui/Tag";
import { useActionPermissionContext } from "../../../../context/ActionPermissionContext";
// import { useTeams } from "../../../teams/hooks/useTeamSearchAll";
import { useState } from "react";
import { useUser } from "../../../authentication/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../../utils/recordUserActivity";
import { parseAction } from "../../../../utils/helpers";
import PassForm from "./PassForm";
import styled from "styled-components";
import { useIDStaffAll } from "../hooks/useUser";
import SignupFormStaff from "./SignupFormStaff";

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

function UserRowStaff({ users }) {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const { user: usersauth } = useUser();

  const allow_Act_Deact = userData.user_metadata.account_role !== "Staff";
  const { actionPermission } = useActionPermissionContext();
  const isAllowedAction = parseAction(
    actionPermission,
    "activation/deactivation user"
  );
  const isAllowedViewPass = parseAction(actionPermission, "view app password");
  const { isDeactivating, deactivateUser } = useDeactivateUser();
  const { isActivating, activateUser } = useActivateUser();
  const { idstaff } = useIDStaffAll();

  const [isAppUser, setIsAppUser] = useState(false);
  const handleAccessTypeChange = (accountrole) => {
    // Check if the accesstype is "App User"
    setIsAppUser(accountrole === "Baco");
  };
  const [heightVar, setHeightVar] = useState("35%");
  const handleValidationSuccess = () => {
    setHeightVar("50%");
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
    brgy,
  } = users;
  const shouldRenderEditButton =
    account_role !== "Super Admin" || userId === usersauth.id;
  return (
    <Table.Row>
      <Stacked>
        <span>{fullname}</span>
        <span>{contactno}</span>
      </Stacked>
      <div>{email}</div>
      <div>{brgy}</div>
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

              {allow_Act_Deact &&
                isAllowedAction &&
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
              {isAllowedViewPass && (
                <Modal.Open opens="viewpass">
                  <Menus.Button icon={<TbPasswordMobilePhone />}>
                    View Password
                  </Menus.Button>
                </Modal.Open>
              )}
            </Menus.List>
            <Modal.Window
              backdrop={true}
              name="viewpass"
              heightvar={isAppUser ? heightVar : heightVar}
            >
              <PassForm
                userToEdit={users}
                teams={idstaff}
                onChangeAccessType={handleAccessTypeChange}
                onValidationSuccess={handleValidationSuccess}
              />
            </Modal.Window>

            <Modal.Window
              backdrop={true}
              name="edit"
              heightvar="55%"
              // heightvar={isAppUser ? "75%" : "100%"}
            >
              <SignupFormStaff
                userToEdit={users}
                baco={idstaff}
                onChangeAccessType={handleAccessTypeChange}
              />
            </Modal.Window>

            <Modal.Window name="activate">
              <ConfirmActivate
                resourceName="user"
                disabled={isActivating}
                // onConfirm={() => activateUser(userId)}
                onConfirm={() => {
                  activateUser(userId);
                  const params = {
                    page: "Users",
                    action: "User activate an account",
                    parameters: users,
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

export default UserRowStaff;
