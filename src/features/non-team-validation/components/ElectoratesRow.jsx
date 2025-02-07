import { useState } from "react";
import supabase from "../../../services/supabase";
import Table from "../../../ui/Table";
import { replaceSpecialChars } from "../../../utils/helpers";
import toast from "react-hot-toast";

function ElectoratesRow({ electorate, index, validation_name }) {
  const {
    id: electorateId,
    precinctno,
    lastname,
    firstname,
    middlename,
    purok,
    firstvalidation_tag,
    secondvalidation_tag,
    thirdvalidation_tag,
    name_ext,
  } = electorate;

  let tag_result;

  if (validation_name === "1st Validation") {
    tag_result = firstvalidation_tag;
  }
  if (validation_name === "2nd Validation") {
    tag_result = secondvalidation_tag;
  }
  if (validation_name === "3rd Validation") {
    tag_result = thirdvalidation_tag;
  }

  const [selectedOption, setSelectedOption] = useState(tag_result);
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
      if (validation_name === "1st Validation") {
        const { data, error: err } = await supabase
          .from("electorates")
          .update({ firstvalidation_tag: value })
          .eq("id", electorateId)
          .select()
          .single();

        if (!err) {
          toast.success("Successfully validated");
        } else {
          toast.success("Unsuccessful validation");
        }

        return data;
      }
      if (validation_name === "2nd Validation") {
        const { data, error: err } = await supabase
          .from("electorates")
          .update({ secondvalidation_tag: value })
          .eq("id", electorateId)
          .select()
          .single();
        if (!err) {
          toast.success("Successfully validated");
        } else {
          toast.success("Unsuccessful validation");
        }

        return data;
      }
      if (validation_name === "3rd Validation") {
        const { data, error: err } = await supabase
          .from("electorates")
          .update({ thirdvalidation_tag: value })
          .eq("id", electorateId)
          .select()
          .single();
        if (!err) {
          toast.success("Successfully validated");
        } else {
          toast.success("Unsuccessful validation");
        }

        return data;
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      throw new Error("An unexpected error occurred during processing.");
    }
  };

  return (
    <Table.Row>
      <div>{index + 1}</div>
      <div>{precinctno}</div>
      <div>{replaceSpecialChars(lastname)}</div>
      <div>{replaceSpecialChars(firstname)}</div>
      <div>{replaceSpecialChars(middlename)}</div>
      <div>{name_ext}</div>
      <div>{purok}</div>
      <div>
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <label className="ml-3">
            <input
              type="radio"
              name={`options-${electorateId}`}
              value="DILI"
              checked={selectedOption === "DILI"}
              onChange={handleInputChange}
              className="peer hidden"
            />
            <span className="block w-5 h-5 border border-gray-400 rounded-full peer-checked:bg-yellow-300 peer-hover:bg-green-200 peer-hover:border-green-500"></span>
            &nbsp;DILI
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
              value="NVS"
              checked={selectedOption === "NVS"}
              onChange={handleInputChange}
              className="peer hidden"
            />
            <span className="block w-5 h-5 border border-gray-400 rounded-full peer-checked:bg-blue-700 peer-hover:bg-green-200 peer-hover:border-green-500"></span>
            &nbsp; NVS
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
        </div>
      </div>
    </Table.Row>
  );
}

export default ElectoratesRow;
