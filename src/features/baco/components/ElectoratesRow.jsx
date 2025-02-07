import Table from "../../../ui/Table";
import { GrSelect } from "react-icons/gr";
import Button from "../../../ui/Button";

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
        <Button onClick={handleSelectElectorate}>
          <div className="flex justify-center items-center">
            <GrSelect className="mr-2" />
            {/* Select */}
          </div>
        </Button>
      </div>
    </Table.Row>
  );
}

export default ElectoratesRow;
