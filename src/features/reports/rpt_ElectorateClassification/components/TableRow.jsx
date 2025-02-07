import Table from "../../../../ui/Table";
import { replaceSpecialChars } from "../../../../utils/helpers";

function TableRow({ electorate, index, scannedvoters }) {
  const {
    id: electorateId,
    precinctno,
    lastname,
    firstname,
    middlename,
    purok,
    brgy,
    team,
  } = electorate;

  return (
    <Table.Row>
      <div>{index + 1}</div>
      <div>{precinctno}</div>
      <div>{replaceSpecialChars(lastname)}</div>
      <div>{replaceSpecialChars(firstname)}</div>
      <div>{replaceSpecialChars(middlename)}</div>
      <div>{purok}</div>
      <div>{brgy}</div>
      <div> {team ? `${team.firstname} ${team.lastname}` : "—"}</div>
    </Table.Row>
  );
}

export default TableRow;
