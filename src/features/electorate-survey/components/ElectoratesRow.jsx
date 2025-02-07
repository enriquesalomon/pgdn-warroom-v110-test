import { useState } from "react";
import supabase from "../../../services/supabase";
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
    survey_tag,
    name_ext,
  } = electorate;

  const [selectedOption, setSelectedOption] = useState(survey_tag);
  console.log("xxxx", selectedOption);
  // Handle input change
  const handleInputChange = async (event) => {
    const value = event.target.value;

    // Show confirmation alert
    const confirm = window.confirm(
      `Are you sure you want to select "${value}" for ${replaceSpecialChars(
        firstname
      )} ${replaceSpecialChars(lastname)}?`
    );

    if (!confirm) {
      return; // Exit if user cancels
    }

    setSelectedOption(value);

    console.log("ang na select id", electorateId);
    console.log("ang na select radio", value);

    try {
      const { data, error: err } = await supabase
        .from("electorates")
        .update({ survey_tag: value })
        .eq("id", electorateId)
        .select()
        .single();

      return data;
    } catch (err) {
      console.error("Unexpected error:", err);
      throw new Error("An unexpected error occurred during processing.");
    }

    // try {
    //   const { data, error } = await supabase
    //     .from("your_table_name") // Replace with your table name
    //     .insert([
    //       {
    //         electorate_id: electorateId,
    //         option: value, // Save the selected option
    //       },
    //     ]);

    //   if (error) {
    //     console.error("Error saving data:", error.message);
    //   } else {
    //     console.log("Data saved successfully:", data);
    //   }
    // } catch (error) {
    //   console.error("Unexpected error:", error);
    // }
  };

  return (
    <Table.Row>
      {/* <div className="flex items-center">
        {ato === true && (
          <span className="inline-block h-5 w-5 rounded-full bg-green-700 mr-2"></span>
        )}
      </div> */}
      {/* <div>{electorateId}</div> */}
      <div>{index + 1}</div>
      <div>{precinctno}</div>
      <div>{replaceSpecialChars(lastname)}</div>
      <div>{replaceSpecialChars(firstname)}</div>
      <div>
        {replaceSpecialChars(middlename)}
        {/* {name_ext} */}
      </div>
      <div>{name_ext}</div>
      <div>{purok}</div>
      <div>
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <label className="ml-3">
            <input
              type="radio"
              name={`options-${electorateId}`}
              value="ATO"
              onChange={handleInputChange}
              checked={selectedOption === "ATO"}
              className="peer hidden"
            />
            <span className="block w-5 h-5 border border-gray-400 rounded-full peer-checked:bg-green-800 peer-hover:bg-green-200 peer-hover:border-green-500"></span>
            &nbsp;ATO
          </label>
          <label className="ml-3">
            <input
              type="radio"
              name={`options-${electorateId}`}
              value="DILI"
              checked={selectedOption === "DILI"}
              onChange={handleInputChange}
              className="peer hidden"
            />
            <span className="block w-5 h-5 border border-gray-400 rounded-full peer-checked:bg-red-800 peer-hover:bg-green-200 peer-hover:border-green-500"></span>
            &nbsp;DILI
          </label>
          <label className="ml-3">
            <input
              type="radio"
              name={`options-${electorateId}`}
              value="OUT OF TOWN"
              checked={selectedOption === "OUT OF TOWN"}
              onChange={handleInputChange}
              className="peer hidden"
            />
            <span className="block w-5 h-5 border border-gray-400 rounded-full peer-checked:bg-yellow-300 peer-hover:bg-green-200 peer-hover:border-green-500"></span>
            &nbsp;OOT
          </label>
          <label className="ml-3">
            <input
              type="radio"
              name={`options-${electorateId}`}
              value="INC"
              checked={selectedOption === "INC"}
              onChange={handleInputChange}
              className="peer hidden"
            />
            <span className="block w-5 h-5 border border-gray-400 rounded-full peer-checked:bg-green-200 peer-hover:bg-green-200 peer-hover:border-green-500"></span>
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
          <label className="ml-3">
            <input
              type="radio"
              name={`options-${electorateId}`}
              value="JEHOVAH"
              checked={selectedOption === "JEHOVAH"}
              onChange={handleInputChange}
              className="peer hidden"
            />
            <span className="block w-5 h-5 border border-gray-400 rounded-full peer-checked:bg-blue-300 peer-hover:bg-green-200 peer-hover:border-green-500"></span>
            &nbsp;JEHOVAH
          </label>
          <label className="ml-3">
            <input
              type="radio"
              name={`options-${electorateId}`}
              value="DECEASED"
              checked={selectedOption === "DECEASED"}
              onChange={handleInputChange}
              className="peer hidden"
            />
            <span className="block w-5 h-5 border border-gray-400 rounded-full peer-checked:bg-black peer-hover:bg-green-200 peer-hover:border-green-500"></span>
            &nbsp; DECEASED
          </label>
          <label className="ml-3">
            <input
              type="radio"
              name={`options-${electorateId}`}
              value="UNDECIDED"
              checked={selectedOption === "UNDECIDED"}
              onChange={handleInputChange}
              className="peer hidden"
            />
            <span className="block w-5 h-5 border border-gray-400 rounded-full peer-checked:bg-gray-500 peer-hover:bg-green-200 peer-hover:border-green-500"></span>
            &nbsp; UNDECIDED
          </label>
          <label className="ml-3">
            <input
              type="radio"
              name={`options-${electorateId}`}
              value="NVS"
              checked={selectedOption === "NVS"}
              onChange={handleInputChange}
              className="peer hidden"
            />
            <span className="block w-5 h-5 border border-gray-400 rounded-full peer-checked:bg-blue-700 peer-hover:bg-green-200 peer-hover:border-green-500"></span>
            &nbsp; NVS
          </label>
        </div>
      </div>
    </Table.Row>
  );
}

export default ElectoratesRow;
