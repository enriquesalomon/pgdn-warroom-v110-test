import Table from "../../../ui/Table";
import { replaceSpecialChars } from "../../../utils/helpers";
function UnscannedTableRow({ electorate, index }) {
  const { precinctno, firstname, middlename, lastname, brgy, purok, team } =
    electorate;

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
        {team?.firstname || ""} {team?.lastname || ""}
      </div>
    </Table.Row>
  );
}

export default UnscannedTableRow;
