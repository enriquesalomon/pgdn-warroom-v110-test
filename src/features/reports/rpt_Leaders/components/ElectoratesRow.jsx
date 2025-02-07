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
    isleader_type,
    islubas_type,
    name_ext,
  } = electorate;
  let asteriskEy;
  if (
    isleader_type === "SILDA LEADER & HOUSEHOLD HEAD" ||
    isleader_type === "HOUSEHOLD HEAD"
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
      <div>{name_ext}</div>
      <div>{purok}</div>
      <div>{brgy}</div>
      <div>{isleader_type}</div>
    </Table.Row>
  );
}

export default ElectoratesRow;
