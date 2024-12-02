import styled from "styled-components";
import CreateTeamForm from "./CreateTeamForm";
import {
  HiPencil,
  HiOutlineUserPlus,
  HiOutlineUserMinus,
} from "react-icons/hi2";
import Modal from "../../../ui/Modal";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import Tag from "../../../ui/Tag";
import ConfirmDeactivate from "../../../ui/ConfirmDeactivate";
import ConfirmActivate from "../../../ui/ConfirmActivate";
import { useDeactivateTeam } from "../hooks/useDeactivateTeam";
import { useActivateTeam } from "../hooks/useActivateTeam";
import { useActionPermissionContext } from "../../../context/ActionPermissionContext";
import { useSettings } from "../../settings/hooks/useSettings";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../utils/recordUserActivity";
import { parseAction } from "../../../utils/helpers";
import { useSecondSelectData } from "../hooks/useData";

const Leader = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

function TeamRow({ teams }) {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const { actionPermission } = useActionPermissionContext();

  const isAllowedAction = parseAction(
    actionPermission,
    "activation/deactivation team"
  );

  const { isDeactivating, deactivateTeam } = useDeactivateTeam();
  const { isActivating, activateTeam } = useActivateTeam();
  const { settings } = useSettings();

  const {
    id: leaderId,
    firstname,
    lastname,
    barangay,
    contactno,
    gender,
    precinctno,
    members,
    position,
    status,
  } = teams;

  const { data: precint_electorates } = useSecondSelectData(precinctno);
  return (
    <Table.Row>
      <Leader>{leaderId}</Leader>
      <div>
        {lastname} , {firstname}
      </div>
      <div>{precinctno}</div>
      <div>{JSON.parse(members).length}</div>
      <div>{gender}</div>
      <div>{contactno}</div>
      <div>{barangay}</div>
      <div>{position === "Validator" ? "PL" : null}</div>
      {status === "active" && <Tag type="green">Active</Tag>}
      {status === "inactive" && <Tag type="red">Inactive</Tag>}
      {status === null && <Tag></Tag>}

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={leaderId} />

            <Menus.List id={leaderId}>
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              {isAllowedAction &&
                (status !== "active" ? (
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
                ))}
            </Menus.List>

            <Modal.Window
              backdrop={true}
              name="edit"
              heightvar="100%"
              widthvar="100%"
            >
              <CreateTeamForm
                teamtoEdit={teams}
                settings={settings}
                precint_electorates={precint_electorates}
                precinctnoDefault={precinctno}
              />
            </Modal.Window>

            <Modal.Window name="activate">
              <ConfirmActivate
                resourceName="leader"
                disabled={isActivating}
                onConfirm={() => {
                  activateTeam(leaderId);
                  const params = {
                    page: "Teams",
                    action: "User activated a Team",
                    parameters: { Leader_id: leaderId },
                    user_id: userData.id,
                  };
                  insertLogs(params);
                }}
              />
            </Modal.Window>

            <Modal.Window name="deactivate">
              <ConfirmDeactivate
                resourceName="leader"
                disabled={isDeactivating}
                onConfirm={() => {
                  deactivateTeam(leaderId);
                  const params = {
                    page: "Teams",
                    action: "User deactivated a Team",
                    parameters: { Leader_id: leaderId },
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

export default TeamRow;
