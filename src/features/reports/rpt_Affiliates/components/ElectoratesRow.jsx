import Table from "../../../../ui/Table";
import Tag from "../../../../ui/Tag";
function ElectoratesRow({ electorate, index }) {
  const {
    validation_name,
    precinctno,
    firstname,
    middlename,
    lastname,
    brgy,
    purok,
    leader_firstname,
    leader_lastname,
    result,
    isleader_type,
    islubas_type,
  } = electorate;
  let asteriskEy;
  if (
    isleader_type === "SILDA LEADER & HOUSEHOLD LEADER" ||
    isleader_type === "HOUSEHOLD LEADER"
  ) {
    asteriskEy = "*";
  }
  return (
    <Table.Row>
      <div>{index + 1}</div>
      <div>{precinctno}</div>
      <div>
        {(asteriskEy || "") + " "}
        {lastname}
      </div>
      <div>{firstname}</div>
      <div>{middlename}</div>
      <div>{purok}</div>
      <div>{brgy}</div>
      <div>{islubas_type}</div>
    </Table.Row>
  );
}

export default ElectoratesRow;
