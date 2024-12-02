import Table from "../../../../ui/Table";
import { useActionPermissionContext } from "../../../../context/ActionPermissionContext";

import { useQueryClient } from "@tanstack/react-query";
import Modal from "../../../../ui/Modal";
import ButtonIcon from "../../../../ui/ButtonIcon";
import { LiaClipboardListSolid } from "react-icons/lia";
import TeamTable from "./TeamTable";

function LeaderRow({ electorate, index }) {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const { actionPermission } = useActionPermissionContext();
  const {
    id,
    lastname,
    firstname,
    middlename,
    brgy,
    purok,
    is_gm,
    is_agm,
    is_legend,
    is_elite,
    precinctno,
    gm_team_count,
    agm_team_count,
    legend_team_count,
    elite_team_count,
  } = electorate;

  const leader_type = is_gm
    ? "GRAND MASTER"
    : is_agm
    ? "ASSISTANT GRAND MASTER"
    : is_legend
    ? "LEGEND"
    : is_elite
    ? "ELITE"
    : null;
  const team_count = is_gm
    ? gm_team_count
    : is_agm
    ? agm_team_count
    : is_legend
    ? legend_team_count
    : is_elite
    ? elite_team_count
    : null;

  return (
    <Table.Row>
      <div>
        {lastname}, {firstname} {middlename}
      </div>
      <div>{!is_gm && !is_agm ? precinctno : ""}</div>
      <div>{leader_type}</div>
      <div>{brgy}</div>
      <div>{team_count}</div>
      <div>
        <Modal>
          <Modal.Open opens="service-form">
            {/* <div className="text-orange-300 flex text-2xl justify-center items-center hover:bg-orange-300 hover:text-white  font-bold py-2 px-4 rounded ">
                <GrOverview className="mr-2  " />
              </div> */}
            <ButtonIcon>
              <div className="inline-flex items-center">
                <LiaClipboardListSolid className="mr-2  " /> List
              </div>
            </ButtonIcon>
          </Modal.Open>
          <Modal.Window
            backdrop={true}
            name="service-form"
            heightvar="100%"
            widthvar="100%"
          >
            <TeamTable
              topleader_name={lastname + "," + firstname + " " + middlename}
              topleader_id={id}
              leader_type={leader_type}
            />
          </Modal.Window>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default LeaderRow;
