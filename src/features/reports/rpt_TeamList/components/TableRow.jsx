import Menus from "../../../../ui/Menus";
import Modal from "../../../../ui/Modal";
import Table from "../../../../ui/Table";
import { replaceSpecialChars } from "../../../../utils/helpers";
import TeamForm from "./TeamForm";
import { LuClipboardList } from "react-icons/lu";
function TableRow({ electorate, index, scannedvoters }) {
  const {
    id,
    precinctno,
    lastname,
    firstname,
    members,
    purok,
    barangay,
    team,
    gm_id,
    agm_id,
    legend_id,
    elite_id,
    baco_id,
    gm_name,
    agm_name,
    legend_name,
    elite_name,
    baco_name,
  } = electorate;

  return (
    <Table.Row>
      <div>{index + 1}</div>
      <div>{baco_name}</div>
      <div>{gm_name}</div>
      <div>{agm_name}</div>
      <div>{legend_name}</div>
      <div>{replaceSpecialChars(elite_name)}</div>
      {/* <div>{precinctno}</div> */}
      <div>{firstname + " " + lastname}</div>

      {/* <div>{purok}</div> */}
      <div>{barangay}</div>
      <div>{JSON.parse(members).length - 1}</div>
      <div className="no-print">
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={id} />

            <Menus.List id={id}>
              <Modal.Open opens="view">
                <Menus.Button icon={<LuClipboardList />}>View</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window
              backdrop={true}
              name="view"
              heightvar="100%"
              widthvar="100%"
            >
              <TeamForm
                electorate={electorate}
                // gm_id={gm_id}
                // agm_id={agm_id}
                // legend_id={legend_id}
                // elite_id={elite_id}
                // // teamtoEdit={teams}
                // // settings={settings}
                // // precint_electorates={precint_electorates}
                // // team_members={team_members}
                // precinctnoDefault={precinctno}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default TableRow;
