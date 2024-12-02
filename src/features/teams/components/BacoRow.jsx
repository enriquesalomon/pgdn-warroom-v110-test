import ButtonIcon from "../../../ui/ButtonIcon";
import Table from "../../../ui/Table";
import { AiOutlineFileAdd } from "react-icons/ai";
import Tag from "../../../ui/Tag";

function BacoRow({
  brgy,
  electorate,
  index,
  onSelectElectorate,
  modal_target,
}) {
  const {
    id: electorateId,
    lastname,
    firstname,
    middlename,
    gender,
    contactno,
    brgy: barangay,
    status,
    added_by,
  } = electorate;
  const handleSelectElectorate = () => {
    if (barangay === brgy) {
      onSelectElectorate(electorate);
    } else {
      alert(
        `The selected Baco barangay must match the team's barangay to create a team.`
      );
    }
  };
  return (
    <Table.Row>
      <div>
        {lastname}, {firstname} {middlename}
      </div>
      <div>{gender}</div>
      <div>{contactno}</div>
      <div>{barangay}</div>
      <div>{added_by}</div>
      {status === "active" && <Tag type="green">Active</Tag>}
      {status === "inactive" && <Tag type="red">Inactive</Tag>}
      {status === null && <Tag></Tag>}

      <div>
        <ButtonIcon onClick={handleSelectElectorate}>
          <div className="flex justify-center items-center">
            <AiOutlineFileAdd className="mr-2" />
            Select
          </div>
        </ButtonIcon>
      </div>
    </Table.Row>
  );
}

export default BacoRow;
