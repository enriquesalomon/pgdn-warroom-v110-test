import Modal from "../../../ui/Modal";
import Table from "../../../ui/Table";
import ButtonIcon from "../../../ui/ButtonIcon";
import { AiOutlineIdcard } from "react-icons/ai";
import IDCard from "./IDCard";

function ElectoratesRow({ electorate, index }) {
  // const {
  //   electorates: { precinctno, lastname, firstname, middlename, purok, brgy },
  // } = electorate;

  const {
    precinctno,
    lastname,
    firstname,
    middlename,
    purok,
    brgy,
    completeaddress,
    name_ext,
    islubas_type,
  } = electorate;

  console.log("electorate row data", JSON.stringify(electorate));
  return (
    <Table.Row>
      <div>{index + 1}</div>
      <div>{precinctno}</div>
      <div>{lastname}</div>
      <div>{firstname}</div>
      <div>{middlename}</div>
      <div> {name_ext ? name_ext : ""}</div>
      <div>{purok}</div>
      <div>{brgy}</div>
      <div>{islubas_type}</div>
      <div>
        <Modal>
          <Modal.Open opens="service-form">
            <ButtonIcon>
              <div className="flex items-center" style={{ color: "#145A32" }}>
                <AiOutlineIdcard className="mr-2 " /> VIEW
              </div>
            </ButtonIcon>
          </Modal.Open>
          <Modal.Window
            backdrop={true}
            name="service-form"
            heightvar="100%"
            widthvar="100%"
          >
            <IDCard electorate={electorate} />
          </Modal.Window>
        </Modal>
      </div>

      {/* <div>
        <ButtonIcon>
          <div className="flex justify-center items-center">
            <AiOutlineIdcard className="mr-2" />
          </div>
        </ButtonIcon>
      </div> */}
    </Table.Row>
  );
}

export default ElectoratesRow;
