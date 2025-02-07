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
      <div>{validation_name}</div>
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
      <div>
        {leader_firstname} {leader_lastname}
      </div>
      <div>
        <span>
          {result === 1 ? (
            <Tag type="green">ATO</Tag>
          ) : result === 2 ? (
            <Tag type="grey">UNDECIDED</Tag>
          ) : result === 3 ? (
            <Tag type="black">
              <div className="line-through">DECEASED</div>
            </Tag>
          ) : result === 4 ? (
            <Tag type="pink">OT</Tag>
          ) : result === 5 ? (
            <Tag type="mintgreen">INC</Tag>
          ) : result === 6 ? (
            <Tag type="grey">JEHOVAH</Tag>
          ) : result === 7 ? (
            <Tag type="orange">NVS</Tag>
          ) : result === 0 ? (
            <Tag type="red">DILI</Tag>
          ) : null}
        </span>
      </div>
    </Table.Row>
  );
}

export default ElectoratesRow;
