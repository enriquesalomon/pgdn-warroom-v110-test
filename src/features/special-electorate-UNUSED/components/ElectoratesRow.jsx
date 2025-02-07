import ButtonIcon from "../../../ui/ButtonIcon";
import Table from "../../../ui/Table";
import { AiOutlineFileAdd } from "react-icons/ai";

function ElectoratesRow({ electorate, index, onSelectElectorate }) {
  const {
    id: electorateId,
    precinctno,
    lastname,
    firstname,
    middlename,
    purok,
    brgy,
  } = electorate;
  const handleSelectElectorate = () => {
    onSelectElectorate(electorate);
  };
  return (
    <Table.Row>
      <div>{electorateId}</div>
      <div>{precinctno}</div>
      <div>{lastname}</div>
      <div>{firstname}</div>
      <div>{middlename}</div>
      <div>{purok}</div>
      <div>{brgy}</div>

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
