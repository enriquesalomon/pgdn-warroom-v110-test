import React, { useEffect, useState } from "react";
import { useGetMembers } from "../hooks/useElectorates";
import { replaceSpecialChars } from "../../../utils/helpers";
import styled from "styled-components";
import Button from "../../../ui/Button";
import SpinnerMini from "../../../ui/SpinnerMini";
import { LiaUserTagSolid } from "react-icons/lia";
import { useValidationSettings_Running } from "../hooks/useValitionSettings";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateValidation } from "../hooks/useCreateValidation";
// import { supabase } from "../../../supabaseClient"; // Supabase client import

const StyledHeader = styled.thead`
  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  color: var(--color-grey-600);
`;
// Styled-component for the radio button
const StyledRadioButton = styled.input`
  /* Hide the default radio button */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #ccc;
  outline: none;
  cursor: pointer;

  &:checked {
    /* Green for ATO, Red for DILI, Blue for Out of Town, and Gray for others */
    border-color: ${(props) =>
      props.value === "1"
        ? "green"
        : props.value === "0"
        ? "red"
        : props.value === "4"
        ? "blue"
        : "gray"};
    background-color: ${(props) =>
      props.value === "1"
        ? "green"
        : props.value === "0"
        ? "red"
        : props.value === "4"
        ? "blue"
        : "gray"};
  }
`;

const TeamView = React.forwardRef((props, ref) => {
  const { isCreating, createValidation } = useCreateValidation();

  const { isPending2, validation_settings = {} } =
    useValidationSettings_Running();
  console.log("validaion---", JSON.stringify(validation_settings));

  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const validator = userData.email;
  let validation_name;
  let val_id;
  if (validation_settings.length > 0) {
    validation_name = validation_settings[0].validation_name;
    val_id = validation_settings[0].id;
  }

  const { id: leader_id, lastname, firstname, barangay } = props.electorate;

  const { data: team_members, isLoading } = useGetMembers(leader_id);
  console.log("team_members", JSON.stringify(team_members));
  const warriors_only = team_members;
  // const warriors_only = team_members?.filter(
  //   (item) => item.id !== electorate_id
  // );

  // State to store the selected values for each row
  const [selectedRows, setSelectedRows] = useState({});

  // Initialize selectedRows when warriors_only data is available
  useEffect(() => {
    if (warriors_only?.length > 0) {
      const initialSelection = warriors_only.reduce((acc, item) => {
        // Determine which validation tag to use based on val_id
        let validationTag = "";
        if (val_id === 1) {
          validationTag = item.firstvalidation_tag;
        } else if (val_id === 2) {
          validationTag = item.secondvalidation_tag;
        } else if (val_id === 3) {
          validationTag = item.thirdvalidation_tag;
        }

        // Map validation tag values to radio values
        const result =
          validationTag === "ATO"
            ? "1"
            : validationTag === "OUT OF TOWN"
            ? "4"
            : "";

        acc[item.id] = {
          ...item,
          result,
        };
        return acc;
      }, {});

      setSelectedRows(initialSelection);
    }
  }, [warriors_only, val_id]); // Ensure it updates when val_id changes

  // Handle radio button change and accumulate data for each row
  const handleRadioChange = (item, value) => {
    setSelectedRows((prevState) => ({
      ...prevState,
      [item.id]: { ...item, result: value }, // Store entire row data with selected status
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Get all selected rows
    const rowsToSave = Object.values(selectedRows);

    console.log("all rows to save--", JSON.stringify(rowsToSave));

    // Transform the data
    const modifiedData_rowsToSave = rowsToSave.map((item) => {
      const {
        id,
        firstname,
        middlename,
        lastname,
        purok,
        precinctno,
        ...rest
      } = item; // Destructure to remove unwanted fields
      return {
        ...rest,
        electorate_id: id,
        leader_id: leader_id, // Add new field leader_id with value "01",
        validation_id: val_id,
        confirmed_by: validator,
      };
    });

    // Check if every row has been validated
    const allRowsValidated = warriors_only.every(
      (item) => selectedRows[item.id]?.result
    );

    if (!allRowsValidated) {
      alert("Please complete all rows before submitting.");
      return;
    }

    // Add team_id and val_id to the object passed to createValidation
    const dataToSave = {
      validated_data: modifiedData_rowsToSave,
      team_id: leader_id,
      val_id: val_id,
    };
    createValidation(dataToSave);
  };

  return (
    <div className="p-12">
      {/* Title centered above the barangay */}
      <h2 className="text-3xl font-bold text-center mb-4">{validation_name}</h2>
      <hr />
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <div className="w-40 text-2xl">BARANGAY:</div>
            <div className="w-3/4 text-2xl font-semibold">{barangay}</div>
          </div>
          {/* <hr className="py-2" /> */}
          <div className="flex items-center mb-2">
            <div className="w-40 text-2xl">LEADER:</div>
            <div className="w-3/4 text-2xl font-semibold">
              {replaceSpecialChars(firstname) +
                " " +
                replaceSpecialChars(lastname)}
              <span className="ml-6 font-thin">{props.t_precinctNo}</span>
            </div>
          </div>
        </div>

        {/* Form to wrap the table and submit button */}
        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto text-2xl">
            <table className="min-w-full border-collapse border border-gray-200">
              <StyledHeader>
                <tr>
                  <th className="px-4 py-2 border border-gray-200 text-left">
                    #
                  </th>
                  <th className="px-4 py-2 border border-gray-200 text-left">
                    Electorate ID
                  </th>
                  <th className="px-4 py-2 border border-gray-200 text-left">
                    Full Name
                  </th>
                  <th className="px-4 py-2 border border-gray-200 text-left">
                    Purok
                  </th>
                  <th className="px-4 py-2 border border-gray-200 text-left">
                    Precinct #
                  </th>
                  <th className="px-4 py-2 border border-gray-200 text-left">
                    Status
                  </th>
                </tr>
              </StyledHeader>
              <tbody>
                {warriors_only?.map((item, index) => (
                  <tr key={item.id} className=" hover:bg-gray-100">
                    <td className="pl-2 pr-0 py-6 border border-gray-200">
                      {index + 1}
                    </td>
                    <td className="pl-2 pr-0 py-6 border border-gray-200">
                      {item.id}
                    </td>
                    <td className="px-4 py-6 border border-gray-200">
                      {replaceSpecialChars(item.lastname) +
                        ", " +
                        replaceSpecialChars(item.firstname) +
                        " " +
                        replaceSpecialChars(item.middlename)}
                      {item.name_ext ? ` ${item.name_ext}` : ""}
                    </td>
                    <td className="px-4 py-6 border border-gray-200">
                      {item.purok}
                    </td>
                    <td className="px-4 py-6 border border-gray-200">
                      {item.precinctno}
                    </td>
                    <td className="px-4 py-6 border border-gray-200">
                      <div className="flex items-center space-x-4">
                        {/* Yes Radio Button */}
                        <label
                          style={{
                            color:
                              selectedRows[item.id]?.result === "1"
                                ? "green"
                                : "black", // Red when DILI is selected
                          }}
                        >
                          <StyledRadioButton
                            type="radio"
                            name={`result-${item.id}`}
                            value="1" // Set the value to 1
                            checked={selectedRows[item.id]?.result === "1"} // Check if status is "1"
                            onChange={() => handleRadioChange(item, "1")} // Pass "1" on change
                          />
                          ATO
                        </label>

                        <label
                          style={{
                            color:
                              selectedRows[item.id]?.result === "4"
                                ? "blue"
                                : "black", // Red when DILI is selected
                          }}
                        >
                          <StyledRadioButton
                            type="radio"
                            name={`result-${item.id}`}
                            value="4"
                            checked={selectedRows[item.id]?.result === "4"}
                            onChange={() => handleRadioChange(item, "4")}
                          />
                          OUT OF TOWN
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {isLoading && <div>Fetching...</div>}
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            {/* <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded"
            >
              Submit
            </button> */}
            <Button type="submit" disabled={isLoading}>
              <div className="flex justify-center items-center">
                {!isCreating ? (
                  <LiaUserTagSolid className="mr-2" />
                ) : (
                  <SpinnerMini />
                )}
                Submit
              </div>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default TeamView;
