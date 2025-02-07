import { HiTrash } from "react-icons/hi2";
import Modal from "../../../ui/Modal";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import { useActionPermissionContext } from "../../../context/ActionPermissionContext";

import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../utils/recordUserActivity";
import { parseAction } from "../../../utils/helpers";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import { useUntagSpecial } from "../hooks/useEditSpecialElectorate";

function SpecialElectorateRow({ electorate, index }) {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const { actionPermission } = useActionPermissionContext();
  const isAllowedAction = parseAction(
    actionPermission,
    "tag special electorate"
  );
  const { isDeleting, untagSpecial } = useUntagSpecial();
  const {
    id,
    precinctno,
    lastname,
    firstname,
    middlename,
    purok,
    brgy,
    survey_tag,
  } = electorate;

  return (
    <Table.Row>
      <div>{index + 1}</div>
      <div>{id}</div>
      <div>{precinctno}</div>
      <div>{lastname}</div>
      <div>{firstname}</div>
      <div>{middlename}</div>
      <div>{purok}</div>
      <div>{brgy}</div>
      <div>{survey_tag}</div>

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={id} />

            <Menus.List id={id}>
              {/* <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open> */}

              {isAllowedAction ? (
                <Modal.Open opens="untag">
                  <Menus.Button icon={<HiTrash />}>Untag</Menus.Button>
                </Modal.Open>
              ) : null}
            </Menus.List>

            <Modal.Window name="untag">
              <ConfirmDelete
                message={`Are you sure you want to Untag this special electorate.? `}
                recordof={`NAME: ${firstname + " " + lastname}`}
                message2={`Existing related records of this electorate validation will also be deleted. This action cannot be undone.`}
                resourceName="Special Tagging Electorate"
                disabled={isDeleting}
                onConfirm={() => {
                  untagSpecial(id);
                  const params = {
                    page: "Special Electorate",
                    action: "User untag a Special Electorate",
                    parameters: {
                      electorate_id: id,
                      firstname: firstname,
                      lastname: lastname,
                      survey_tag: survey_tag,
                    },
                    user_id: userData.id,
                  };
                  insertLogs(params);
                }}
                btnText={"Confirm Untag"}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default SpecialElectorateRow;
