import Table from "../../../ui/Table";

function ScannedTableRow({ electorate, index, scannedvoters }) {
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
      <div>{lastname}</div>
      <div>{firstname}</div>
      <div>{middlename}</div>
      <div>{purok}</div>
      <div>{brgy}</div>
      <div>
        {team.firstname} {team.lastname}
      </div>
    </Table.Row>
  );
}

export default ScannedTableRow;
