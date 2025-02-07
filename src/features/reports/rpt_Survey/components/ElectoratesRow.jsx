import Table from "../../../../ui/Table";
import Tag from "../../../../ui/Tag";
function ElectoratesRow({ electorate, index }) {
  console.log("xx", JSON.stringify(electorate));
  const {
    validation_name,
    precinctno,
    firstname,
    middlename,
    lastname,
    brgy,
    purok,
    isleader_type,
    survey_tag,
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
      <div>
        <span>
          {survey_tag === "ATO" ? (
            <Tag type="green">ATO</Tag>
          ) : survey_tag === "UNDECIDED" ? (
            <Tag type="yellow">UNDECIDED</Tag>
          ) : survey_tag === "DILI" ? (
            <Tag type="red">DILI</Tag>
          ) : survey_tag === "OUT OF TOWN" ? (
            <Tag type="pink">OUT OF TOWN</Tag>
          ) : survey_tag === "INC" ? (
            <Tag type="mintgreen">INC</Tag>
          ) : survey_tag === "JEHOVAH" ? (
            <Tag type="grey">JEHOVAH</Tag>
          ) : survey_tag === "DECEASED" ? (
            <Tag type="black">
              <span className="text-white">DECEASED</span>
            </Tag>
          ) : survey_tag === "NVS" ? (
            <Tag type="orange">
              <span className="text-white">NVS</span>
            </Tag>
          ) : null}
        </span>
      </div>
    </Table.Row>
  );
}

export default ElectoratesRow;
