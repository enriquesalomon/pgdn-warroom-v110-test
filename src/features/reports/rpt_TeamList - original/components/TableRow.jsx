import Menus from "../../../../ui/Menus";
import Modal from "../../../../ui/Modal";
import Table from "../../../../ui/Table";
// import { replaceSpecialChars } from "../../../../utils/helpers";
import TeamForm from "./TeamForm";
import { LuClipboardList } from "react-icons/lu";
function TableRow({ electorate, index, scannedvoters }) {
  const { id, lastname, firstname, members, barangay, isleader_type } =
    electorate;
  let asteriskEy;
  if (
    isleader_type === "SILDA LEADER & HOUSEHOLD LEADER" ||
    isleader_type === "HOUSEHOLD LEADER"
  ) {
    asteriskEy = "*";
  }
  return (
    <Table.Row>
      <div>{index + 1}</div>
      <div>
        {(asteriskEy || "") + " "}
        {lastname + ", " + firstname}
      </div>
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
              <TeamForm electorate={electorate} />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default TableRow;
