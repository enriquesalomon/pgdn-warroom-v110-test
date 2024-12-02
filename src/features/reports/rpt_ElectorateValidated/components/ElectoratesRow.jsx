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
  } = electorate;

  return (
    <Table.Row>
      <div>{index + 1}</div>
      <div>{validation_name}</div>
      <div>{precinctno}</div>
      <div>{firstname}</div>
      <div>{middlename}</div>
      <div>{lastname}</div>
      <div>{purok}</div>
      <div>{brgy}</div>
      <div>
        {leader_firstname} {leader_lastname}
      </div>
      <div>
        <span>
          {result === 1 ? (
            <Tag type="orange">ATO</Tag>
          ) : result === 2 ? (
            <Tag type="grey">Undecided</Tag>
          ) : result === 3 ? (
            <Tag type="black">
              <div className="line-through">Deceased</div>
            </Tag>
          ) : (
            <Tag type="red">DILI</Tag>
          )}
        </span>
      </div>
    </Table.Row>
  );
}

export default ElectoratesRow;
