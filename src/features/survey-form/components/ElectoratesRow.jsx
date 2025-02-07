import Table from "../../../ui/Table";
import { replaceSpecialChars } from "../../../utils/helpers";

function ElectoratesRow({ electorate, index }) {
  const {
    id: electorateId,
    precinctno,
    lastname,
    firstname,
    middlename,
    purok,
  } = electorate;

  return (
    <Table.Row>
      {/* <div className="flex items-center">
        {ato === true && (
          <span className="inline-block h-5 w-5 rounded-full bg-green-700 mr-2"></span>
        )}
      </div> */}
      <div>{index + 1}</div>
      <div>{precinctno}</div>
      <div>{replaceSpecialChars(lastname)}</div>
      <div>{replaceSpecialChars(firstname)}</div>
      <div>{replaceSpecialChars(middlename)}</div>
      <div>{purok}</div>
      <div>
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <label>
            <input
              type="checkbox"
              name="options"
              value="ATO"
              onClick={(e) => e.preventDefault()}
              style={{ pointerEvents: "none" }}
            />
            &nbsp;ATO
          </label>
          <label>
            <input
              type="checkbox"
              name="options"
              value="DILI"
              onClick={(e) => e.preventDefault()}
              style={{ pointerEvents: "none" }}
            />
            &nbsp;DILI
          </label>
          <label>
            <input
              type="checkbox"
              name="options"
              value="OOT"
              onClick={(e) => e.preventDefault()}
              style={{ pointerEvents: "none" }}
            />
            &nbsp;OOT
          </label>
          <label>
            <input
              type="checkbox"
              name="options"
              value="INC"
              onClick={(e) => e.preventDefault()}
              style={{ pointerEvents: "none" }}
            />
            &nbsp;INC
          </label>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            marginTop: 10,
          }}
        >
          <label>
            <input
              type="checkbox"
              name="options"
              value="JEHOVAH"
              onClick={(e) => e.preventDefault()}
              style={{ pointerEvents: "none" }}
            />
            &nbsp;JEHOVAH
          </label>
          <label>
            <input
              type="checkbox"
              name="options"
              value="DECEASED"
              onClick={(e) => e.preventDefault()}
              style={{ pointerEvents: "none" }}
            />
            &nbsp; DECEASED
          </label>
          <label>
            <input
              type="checkbox"
              name="options"
              value="UNDECIDED"
              onClick={(e) => e.preventDefault()}
              style={{ pointerEvents: "none" }}
            />
            &nbsp; UNDECIDED
          </label>
          <label>
            <input
              type="checkbox"
              name="options"
              value="NVS"
              onClick={(e) => e.preventDefault()}
              style={{ pointerEvents: "none" }}
            />
            &nbsp; NVS
          </label>
        </div>
      </div>
    </Table.Row>
  );
}

export default ElectoratesRow;
