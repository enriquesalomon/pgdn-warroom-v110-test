import Modal from "../../../ui/Modal";
import Table from "../../../ui/Table";
import ButtonIcon from "../../../ui/ButtonIcon";
import { AiOutlineIdcard } from "react-icons/ai";
import IDCard from "./IDCard";
import Menus from "../../../ui/Menus";
import Tag from "../../../ui/Tag";
import { useState } from "react";
import supabase from "../../../services/supabase";
import ImageCopperDraggable from "./ImageCopperDraggable";
import styled from "styled-components";
import { replaceSpecialChars } from "../../../utils/helpers";
const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  /* 
  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  } */
`;
function ElectoratesRow({
  electorate,
  index,
  debouncedSearchTerm,
  data_colorCode,
}) {
  const {
    id: electorateId,
    precinctno,
    lastname,
    firstname,
    middlename,
    purok,
    brgy,
    completeaddress,
    id_printed_status,
    image,
    signature,
    qr_code_url,
    asenso_color_code_url,
  } = electorate;
  console.log(
    "electorate row data data_colorCode",
    JSON.stringify(data_colorCode)
  );

  // const [isChecked, setIsChecked] = useState(false);
  const [isChecked, setIsChecked] = useState(!!id_printed_status); // Initialize with idprint_status

  // Handle checkbox state change
  const handleCheckboxChange = async (event) => {
    const checked = event.target.checked;

    // Show confirmation alert
    const confirmChange = window.confirm(
      `Are you sure you want to mark this ID as ${
        checked ? "printed" : "not printed"
      }?`
    );

    if (!confirmChange) {
      // If the user selects "No", reset the checkbox to its previous state
      event.target.checked = isChecked;
      return;
    }

    setIsChecked(checked); // Update state

    try {
      const { error } = await supabase
        .from("electorates") // Replace with your actual table name
        .update({ id_printed_status: checked }) // Update the idprint_status column
        .eq("id", electorateId); // Match the ID of the current electorate

      if (error) throw error;
      console.log(
        `Updated idprint_status to ${checked} for ID: ${electorateId}`
      );
    } catch (err) {
      console.error("Error updating Supabase:", err.message);
    }
  };

  return (
    <Table.Row>
      <div>{index + 1}</div>
      <div>{precinctno}</div>
      <div>{replaceSpecialChars(lastname)}</div>
      <div>{replaceSpecialChars(firstname)}</div>
      <div>{replaceSpecialChars(middlename)}</div>
      {/* <div>{purok}</div> */}
      <div className="w-54 overflow-hidden truncate">
        {replaceSpecialChars(purok) + ", " + brgy}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        {isChecked ? "Printed" : "Not Printed"}
      </div>
      <Stacked>
        {image === null && (
          <span className="text-lg text-red-700">No Picture</span>
        )}
        {signature === null && (
          <span className="text-lg text-red-700">No Signature</span>
        )}
        {qr_code_url === null && (
          <span className="text-lg text-red-700">No QR Code</span>
        )}
        {asenso_color_code_url === null && (
          <span className="text-lg text-red-700">No Color Code</span>
        )}
      </Stacked>

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={electorateId} />

            <Menus.List id={electorateId}>
              <Modal.Open opens="img_crop">
                <Menus.Button icon={<AiOutlineIdcard />}>
                  Upload Picture|Signature|QRCode|ColorCode
                </Menus.Button>
              </Modal.Open>
              {/* <Modal.Open opens="view_card">
                <Menus.Button icon={<AiOutlineIdcard />}>
                  View Card
                </Menus.Button>
              </Modal.Open> */}
            </Menus.List>

            <Modal.Window name="img_crop" heightvar="100%" widthvar="100%">
              <div className="mt-6">
                {/* <ImageCropper electorate={electorate} /> */}
                <ImageCopperDraggable
                  data_colorCode={data_colorCode}
                  electorate={electorate}
                  debouncedSearchTerm={debouncedSearchTerm}
                />
              </div>
            </Modal.Window>
            <Modal.Window
              backdrop={true}
              name="view_card"
              heightvar="100%"
              widthvar="100%"
            >
              <IDCard electorate={electorate} />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
      {/* <div>
        <Modal>
          <Modal.Open opens="service-form">
            <ButtonIcon>
              <div className="flex items-center" style={{ color: "#FFA500" }}>
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
      </div> */}
    </Table.Row>
  );
}

export default ElectoratesRow;
