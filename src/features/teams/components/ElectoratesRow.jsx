import ButtonIcon from "../../../ui/ButtonIcon";
import Table from "../../../ui/Table";
import { AiOutlineFileAdd } from "react-icons/ai";

function ElectoratesRow({
  brgy,
  electorate,
  index,
  onSelectElectorate,
  modal_target,
}) {
  const {
    id: electorateId,
    precinctno,
    lastname,
    firstname,
    middlename,
    purok,
    brgy: barangay,
    is_gm,
    is_agm,
    is_legend,
    is_elite,
  } = electorate;
  const handleSelectElectorate = () => {
    if (barangay !== brgy) {
      alert(
        `The selected Personnel's barangay must match the team's barangay to create a team.`
      );
      return null;
    }
    const conditions = {
      gm: is_agm === null && is_legend === null && is_elite === null,
      agm: is_gm === null && is_legend === null && is_elite === null,
      legend: is_agm === null && is_gm === null && is_elite === null,
      elite: is_agm === null && is_legend === null && is_gm === null,
    };

    let reason_position = null;
    if (is_gm) {
      reason_position = "a GM";
    } else if (is_agm) {
      reason_position = "an AGM";
    } else if (is_legend) {
      reason_position = "a Legend";
    } else if (is_elite) {
      reason_position = "an Elite";
    }
    if (conditions[modal_target]) {
      onSelectElectorate(electorate);
    } else {
      alert(`Cannot Select this Electorate it is already ${reason_position}`);
      return null;
    }
  };
  return (
    <Table.Row>
      <div>{electorateId}</div>
      <div>{precinctno}</div>
      <div>{lastname}</div>
      <div>{firstname}</div>
      <div>{middlename}</div>
      <div>{purok}</div>
      <div>{barangay}</div>

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

export default ElectoratesRow;
