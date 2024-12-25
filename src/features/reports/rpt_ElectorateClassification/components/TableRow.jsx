import Table from "../../../../ui/Table";
import { PAGE_SIZE } from "../../../../utils/constants";
import { replaceSpecialChars } from "../../../../utils/helpers";

function TableRow({ page, electorate, index, scannedvoters }) {
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
      <div>{(page - 1) * PAGE_SIZE + index + 1}</div>
      <div>{precinctno}</div>
      <div>{replaceSpecialChars(lastname)}</div>
      <div>{replaceSpecialChars(firstname)}</div>
      <div>{replaceSpecialChars(middlename)}</div>
      <div>{purok}</div>
      <div>{brgy}</div>
      <div> {team ? `${team.baco_name}` : "—"}</div>
      <div> {team ? `${team.gm_name}` : "—"}</div>
      <div> {team ? `${team.agm_name}` : "—"}</div>
      <div> {team ? `${team.legend_name}` : "—"}</div>
      <div> {team ? `${team.elite_name}` : "—"}</div>
      <div> {team ? `${team.firstname} ${team.lastname}` : "—"}</div>
    </Table.Row>
  );
}

export default TableRow;
