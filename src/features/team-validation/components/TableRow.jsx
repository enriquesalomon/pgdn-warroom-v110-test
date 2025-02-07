import Menus from "../../../ui/Menus";
import Modal from "../../../ui/Modal";
import Table from "../../../ui/Table";
// import { replaceSpecialChars } from "../../../../utils/helpers";
import TeamForm from "./TeamForm";
import { LuClipboardList } from "react-icons/lu";
function TableRow({ electorate, index, scannedvoters, validation_running }) {
  // console.log("validation_running", JSON.stringify(validation_running[0].id));
  let activatedValidation = validation_running?.[0]?.id || null;
  const {
    id,
    lastname,
    firstname,
    members,
    barangay,
    is_validated1,
    is_validated2,
    is_validated3,
    isleader_type,
  } = electorate;
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
      <div>{id}</div>
      <div>
        {(asteriskEy || "") + " "}
        {lastname + ", " + firstname}
      </div>
      <div>{barangay}</div>
      <div>{JSON.parse(members).length - 1}</div>
      <div> {is_validated1 ? "Validated" : ""}</div>
      <div> {is_validated2 ? "Validated" : ""}</div>
      <div> {is_validated3 ? "Validated" : ""}</div>

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={id} />

            <Menus.List id={id}>
              <Modal.Open opens="view">
                <Menus.Button icon={<LuClipboardList />}>Validate</Menus.Button>
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
