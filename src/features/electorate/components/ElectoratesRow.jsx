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

// Mapping for rmks characters
const mapping = {
  "*": "18-30",
  A: "Illiterate",
  B: "PWD",
  C: "Senior Citizen",
};
function ElectoratesRow({ sector, electorate, index, searchTerm, className }) {
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
    rmks,
    isbaco,
    is_gm,
    is_agm,
    is_legend,
    is_elite,
    isleader_type,
    name_ext,
    remarks_18_30,
    remarks_pwd,
    remarks_illiterate,
    remarks_senior_citizen,
    qr_code,
  } = electorate;
  let asteriskEy;
  if (
    isleader_type === "SILDA LEADER & HOUSEHOLD LEADER" ||
    isleader_type === "HOUSEHOLD LEADER"
  ) {
    asteriskEy = "*";
  }

  let ato = false;
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
      {/* <div className="flex items-center">
        {ato === true && (
          <span className="inline-block h-5 w-5 rounded-full bg-green-700 mr-2"></span>
        )}
      </div> */}
      <div>{electorateId}</div>
      <div>{precinctno}</div>
      <div>
        {(asteriskEy || "") + " "}
        {replaceSpecialChars(lastname)}
      </div>
      <div>{replaceSpecialChars(firstname)}</div>
      <div>{replaceSpecialChars(middlename)}</div>
      <div> {name_ext}</div>
      {/* <Stacked>
        <span>{remarks_18_30 ? "18-30" : ""}</span>
        <span> {remarks_pwd ? "PWD" : ""}</span>
        <span> {remarks_illiterate ? "Illiterate" : ""}</span>
        <span> {remarks_senior_citizen ? "Senior Citizen" : ""}</span>
      </Stacked> */}
      {/* <Stacked>
        <span>{rmks ? "18-30" : ""}</span>
      </Stacked> */}
      <Stacked>
        {rmks
          ? [...rmks]
              .filter((char) => mapping[char]) // Only include characters that exist in the mapping
              .map((char, index) => (
                <span key={index}>{mapping[char]}</span> // Render each equivalent meaning
              ))
          : ""}
      </Stacked>
      <div>{purok}</div>
      <div>{brgy}</div>
      <div>{city}</div>

      <div className="no-print">
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
