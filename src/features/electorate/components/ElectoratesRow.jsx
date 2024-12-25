import ElectorateForm from "./ElectorateForm";
import { HiPencil, HiTrash } from "react-icons/hi2";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import { useDeleteElectorate } from "../hooks/useDeleteElectorate";
import { useActionPermissionContext } from "../../../context/ActionPermissionContext";
import { replaceSpecialChars } from "../../../utils/helpers";
import styled from "styled-components";

// const Img = styled.img`
//   display: block;
//   width: 6.4rem;
//   aspect-ratio: 3 / 2;
//   object-fit: cover;
//   object-position: center;
//   transform: scale(1.5) translateX(-7px);
// `;
const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;
function ElectoratesRow({ sector, electorate, index, searchTerm }) {
  const { actionPermission } = useActionPermissionContext();
  const { isDeleting, deleteElectorate } = useDeleteElectorate();
  const isAllowedAction = actionPermission.includes("delete electorate");
  const {
    id: electorateId,
    precinctno,
    lastname,
    firstname,
    middlename,
    purok,
    brgy,
    city,
    precinctleader,
    isbaco,
    is_gm,
    is_agm,
    is_legend,
    is_elite,
    remarks_18_30,
    remarks_pwd,
    remarks_illiterate,
    remarks_senior_citizen,
  } = electorate;
  console.log("test", JSON.stringify(electorate));
  let ato = false;

  // Reformat birthdate from dd/mm/yyy to yyyy-mm-dd to pass into the date picker input
  // Check if birthdate exists and is in the expected format
  if (electorate.birthdate && electorate.birthdate.includes("/")) {
    const parts = electorate.birthdate.split("/");

    if (parts.length === 3) {
      // Ensure the split array has 3 elements
      const day = parts[0].padStart(2, "0");
      const month = parts[1].padStart(2, "0");
      const year = parts[2];

      electorate.birthdate = `${year}-${month}-${day}`;
    } else {
      console.error("Unexpected birthdate format:", electorate.birthdate);
    }
  } else {
    console.log(
      "Birthdate does not contain a '/' or is undefined:",
      electorate.birthdate
    );
  }
  if (
    precinctleader !== null ||
    isbaco === true ||
    is_gm === true ||
    is_agm === true ||
    is_legend === true ||
    is_elite === true
  ) {
    ato = true;
  }
  return (
    <Table.Row>
      <div className="flex items-center">
        {ato === true && (
          <span className="inline-block h-5 w-5 rounded-full bg-orange-400 mr-2"></span>
        )}
      </div>
      <div>{electorateId}</div>
      <div>{precinctno}</div>
      <div>{replaceSpecialChars(lastname)}</div>
      <div>{replaceSpecialChars(firstname)}</div>
      <div>{replaceSpecialChars(middlename)}</div>
      <div>{replaceSpecialChars(purok)}</div>
      <div>{brgy}</div>
      <Stacked>
        <span>{remarks_18_30 ? "18-30" : ""}</span>
        <span> {remarks_pwd ? "PWD" : ""}</span>
        <span> {remarks_illiterate ? "Illiterate" : ""}</span>
        <span> {remarks_senior_citizen ? "Senior Citizen" : ""}</span>
      </Stacked>

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={electorateId} />

            <Menus.List id={electorateId}>
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              {isAllowedAction ? (
                <Modal.Open opens="delete">
                  <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                </Modal.Open>
              ) : null}
            </Menus.List>

            <Modal.Window name="edit" heightvar="90%">
              <ElectorateForm
                searchText={searchTerm}
                electorateToEdit={electorate}
              />
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="electorates"
                disabled={isDeleting}
                onConfirm={() => deleteElectorate(electorateId)}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default ElectoratesRow;
