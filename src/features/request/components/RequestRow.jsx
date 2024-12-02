import styled from "styled-components";
import CreateTeamForm from "./CreateTeamForm";
import Modal from "../../../ui/Modal";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import Tag from "../../../ui/Tag";
import { VscOpenPreview } from "react-icons/vsc";
import { format } from "date-fns";
import { useElectorate } from "../hooks/useRequest";
import DelistTeamForm from "./DelistTeamForm";
import ListingTeamForm from "./ListingTeamForm";
import OTINCJVForm from "./OTINCJVForm";

const Leader = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

function RequestRow({ ValidationSettings, requests, table_type }) {
  const {
    id,
    request_id,
    leader_id,
    baco_id,
    baco,
    members,
    request_type,
    created_at,
    request_status,
    confirmed_by,
    brgy,
    remarks,
    gm_id,
    agm_id,
    legend_id,
    elite_id,
  } = requests;

  const { data: leader } = useElectorate(leader_id);

  // converting wrong format of members array into correct format
  const dataArray_members = members
    .replace(/[[\]\s]/g, "")
    .split(",")
    .map(Number); // Remove brackets and spaces

  const transformedData = {
    id: id,
    baco_id: baco_id,
    request_id: id,
    request_code: request_id,
    created_at: created_at,
    firstname: requests.electorates?.firstname,
    middlename: requests.electorates?.middlename,
    lastname: requests.electorates?.lastname,
    barangay: requests.baco?.brgy, // Static value
    members: dataArray_members,
    contactno: "",
    gender: "",
    image: null,
    position: "Validator",
    status: "active",
    precinctno: requests.electorates?.precinctno,
    electorate_id: leader_id,
    members_name: dataArray_members,
    added_by: "",
    gm_id: gm_id,
    agm_id: agm_id,
    legend_id: legend_id,
    elite_id: elite_id,
  };

  const parsedMembers = JSON.parse(members);
  return (
    <Table.Row>
      <Leader>{id}</Leader>
      <div>
        <span>{format(new Date(created_at), "MMM dd yyyy  hh:mm:ss a")}</span>
      </div>
      <div>{request_id}</div>
      <div>
        {baco?.lastname} , {baco?.firstname} {baco?.middlename}
      </div>
      {/* <div>
        {request_type === "ADD"
          ? parsedMembers.length + 1
          : parsedMembers.length}
      </div> */}
      <div>{parsedMembers.length}</div>

      <div>{request_type}</div>
      <div>{brgy}</div>
      {request_status === "PENDING" && <Tag type="yellow">PENDING</Tag>}
      {request_status === "APPROVED" && <Tag type="green">APPROVED</Tag>}
      {request_status === "DISAPPROVED" && <Tag type="red">DISAPPROVED</Tag>}
      {request_status === null && <Tag></Tag>}
      {table_type !== "PENDING" && <div>{confirmed_by}</div>}

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={id} />

            <Menus.List id={id}>
              {request_type === "ADD" && (
                <Modal.Open opens="add">
                  <Menus.Button icon={<VscOpenPreview />}>Preview</Menus.Button>
                </Modal.Open>
              )}
              {request_type === "DELISTING" && (
                <Modal.Open opens="delisting">
                  <Menus.Button icon={<VscOpenPreview />}>Preview</Menus.Button>
                </Modal.Open>
              )}
              {request_type === "LISTING" && (
                <Modal.Open opens="listing">
                  <Menus.Button icon={<VscOpenPreview />}>Preview</Menus.Button>
                </Modal.Open>
              )}
              {request_type === "OUT OF TOWN" && (
                <Modal.Open opens="othr">
                  <Menus.Button icon={<VscOpenPreview />}>Preview</Menus.Button>
                </Modal.Open>
              )}
              {request_type === "INC" && (
                <Modal.Open opens="othr">
                  <Menus.Button icon={<VscOpenPreview />}>Preview</Menus.Button>
                </Modal.Open>
              )}
              {request_type === "JEHOVAH" && (
                <Modal.Open opens="othr">
                  <Menus.Button icon={<VscOpenPreview />}>Preview</Menus.Button>
                </Modal.Open>
              )}
            </Menus.List>

            <Modal.Window
              backdrop={true}
              name="othr"
              heightvar="100%"
              widthvar="50%"
            >
              <OTINCJVForm
                teamtoEdit={transformedData}
                leader={leader}
                baco={baco}
                reqcode={request_id}
                request_status={request_status}
                request_type={request_type}
              />
            </Modal.Window>

            <Modal.Window
              backdrop={true}
              name="listing"
              heightvar="100%"
              widthvar="100%"
            >
              <ListingTeamForm
                teamtoEdit={transformedData}
                leader={leader}
                baco={baco}
                reqcode={request_id}
                request_status={request_status}
                request_type={request_type}
              />
            </Modal.Window>

            <Modal.Window
              backdrop={true}
              name="delisting"
              heightvar="100%"
              widthvar="100%"
            >
              <DelistTeamForm
                teamtoEdit={transformedData}
                leader={leader}
                baco={baco}
                reqcode={request_id}
                request_status={request_status}
                request_type={request_type}
                delisted_remarks={remarks}
              />
            </Modal.Window>

            <Modal.Window
              backdrop={true}
              name="add"
              heightvar="100%"
              widthvar="100%"
            >
              <CreateTeamForm
                teamtoEdit={transformedData}
                leader={leader}
                baco={baco}
                reqcode={request_id}
                request_status={request_status}
                request_type={request_type}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default RequestRow;
