import Table from "../../../ui/Table";
import { replaceSpecialChars } from "../../../utils/helpers";
function UnscannedTableRow({ electorate, index }) {
  const {
    precinctno,
    firstname,
    middlename,
    lastname,
    brgy,
    purok,
    leader_firstname,
    leader_lastname,
  } = electorate;

  return (
    <Table.Row>
      <div>{index + 1}</div>
      <div>{precinctno}</div>
      <div>{replaceSpecialChars(lastname)}</div>
      <div>{replaceSpecialChars(firstname)}</div>
      <div>{replaceSpecialChars(middlename)}</div>
      <div>{replaceSpecialChars(purok)}</div>
      <div>{brgy}</div>
      <div>
        {leader_firstname} {leader_lastname}
      </div>
    </Table.Row>
  );
}

export default UnscannedTableRow;
