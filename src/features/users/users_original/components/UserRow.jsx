import styled from "styled-components";

// import CreateLeaderForm from "./CreateLeaderForm";
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
import { decryptPassword } from "../../../../utils/cryptoUtils";
import { useActionPermissionContext } from "../../../../context/ActionPermissionContext";
import { useTeams } from "../../../teams/hooks/useTeamSearchAll";
import { useState } from "react";
import { useUser } from "../../../authentication/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../../utils/recordUserActivity";
import { parseAction } from "../../../../utils/helpers";
// const TableRow = styled.div`
//   display: grid;
//   grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
//   column-gap: 2.4rem;
//   align-items: center;
//   padding: 1.4rem 2.4rem;

//   &:not(:last-child) {
//     border-bottom: 1px solid var(--color-grey-100);
//   }
// `;

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Leader = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

// const Price = styled.div`
//   font-family: "Sono";
//   font-weight: 600;
// `;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

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
    user_pass,
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
      {users.team ? (
        <div>
          {users.team.firstname} {users.team.lastname}
        </div>
      ) : (
        <div></div>
      )}
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
                // onConfirm={() => activateUser(userId)}
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
