import { useSearchParams } from "react-router-dom";
import Table from "../../../../ui/Table";
import Tag from "../../../../ui/Tag";
function ElectoratesRow({ electorate, index }) {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation") || "1v";
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
    firstvalidation_tag,
    secondvalidation_tag,
    thirdvalidation_tag,
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
        {validationType === "1v" && (
          <span>
            {firstvalidation_tag === "UNDECIDED" ? (
              <Tag type="yellow">UNDECIDED</Tag>
            ) : firstvalidation_tag === "DILI" ? (
              <Tag type="red">DILI</Tag>
            ) : firstvalidation_tag === "INC" ? (
              <Tag type="mintgreen">INC</Tag>
            ) : firstvalidation_tag === "JEHOVAH" ? (
              <Tag type="grey">JEHOVAH</Tag>
            ) : firstvalidation_tag === "DECEASED" ? (
              <Tag type="black">
                <span className="text-white">DECEASED</span>
              </Tag>
            ) : firstvalidation_tag === "NVS" ? (
              <Tag type="orange">
                <span className="text-white">NVS</span>
              </Tag>
            ) : null}
          </span>
        )}
        {validationType === "2v" && (
          <span>
            {secondvalidation_tag === "UNDECIDED" ? (
              <Tag type="yellow">UNDECIDED</Tag>
            ) : secondvalidation_tag === "DILI" ? (
              <Tag type="red">DILI</Tag>
            ) : secondvalidation_tag === "INC" ? (
              <Tag type="mintgreen">INC</Tag>
            ) : secondvalidation_tag === "JEHOVAH" ? (
              <Tag type="grey">JEHOVAH</Tag>
            ) : secondvalidation_tag === "DECEASED" ? (
              <Tag type="black">
                <span className="text-white">DECEASED</span>
              </Tag>
            ) : secondvalidation_tag === "NVS" ? (
              <Tag type="orange">
                <span className="text-white">NVS</span>
              </Tag>
            ) : null}
          </span>
        )}
        {validationType === "3v" && (
          <span>
            {thirdvalidation_tag === "UNDECIDED" ? (
              <Tag type="yellow">UNDECIDED</Tag>
            ) : thirdvalidation_tag === "DILI" ? (
              <Tag type="red">DILI</Tag>
            ) : thirdvalidation_tag === "INC" ? (
              <Tag type="mintgreen">INC</Tag>
            ) : thirdvalidation_tag === "JEHOVAH" ? (
              <Tag type="grey">JEHOVAH</Tag>
            ) : thirdvalidation_tag === "DECEASED" ? (
              <Tag type="black">
                <span className="text-white">DECEASED</span>
              </Tag>
            ) : thirdvalidation_tag === "NVS" ? (
              <Tag type="orange">
                <span className="text-white">NVS</span>
              </Tag>
            ) : null}
          </span>
        )}
      </div>
    </Table.Row>
  );
}

export default ElectoratesRow;
