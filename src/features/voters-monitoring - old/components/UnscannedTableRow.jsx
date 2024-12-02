import Table from "../../../ui/Table";

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
      <div>{lastname}</div>
      <div>{firstname}</div>
      <div>{middlename}</div>
      <div>{purok}</div>
      <div>{brgy}</div>
      <div>
        {leader_firstname} {leader_lastname}
      </div>
    </Table.Row>
  );
}

export default UnscannedTableRow;
