import React, { useEffect, useState } from "react";
import { useGetMembers } from "../hooks/useTeams";
import { replaceSpecialChars } from "../../../utils/helpers";
import styled from "styled-components";
import Button from "../../../ui/Button";
import SpinnerMini from "../../../ui/SpinnerMini";
import { LiaUserTagSolid } from "react-icons/lia";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateMemberTagging } from "../hooks/useCreateMemberTagging";
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

const TeamViewTag = React.forwardRef((props, ref) => {
  const { isCreating, createTag } = useCreateMemberTagging();

  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const validator = userData.email;

  const { id: leader_id, lastname, firstname, barangay } = props.electorate;

  const { data: team_members, isLoading } = useGetMembers(leader_id);
  console.log("team_members1", JSON.stringify(team_members));

  const warriors_only = team_members;

  // State to store the selected values for each row
  const [selectedRows, setSelectedRows] = useState({});

  // Populate `selectedRows` when `team_members` changes
  useEffect(() => {
    if (team_members) {
      const initialSelection = team_members.reduce((acc, member) => {
        acc[member.id] = { ...member }; // Store the entire member object
        return acc;
      }, {});
      setSelectedRows(initialSelection);
    }
  }, [team_members]);

  const handleRadioChange = (item, value) => {
    setSelectedRows((prevState) => ({
      ...prevState,
      [item.id]: { ...item, isleader_type: value }, // Store entire row data with updated `isleader_type`
    }));
  };

  // // Handle form submit to save all the selected data to Supabase
  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   const rowsToSave = Object.values(selectedRows); // Get all selected rows
  //   console.log("capture row data,...", rowsToSave);
  // };
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Get all selected rows
    const rowsToSave = Object.values(selectedRows);

    console.log("all rows to save 1--", JSON.stringify(rowsToSave));

    // // Transform the data
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
        leader_id: leader_id,
        confirmed_by: validator,
      };
    });

    console.log(
      "all rows to save 2--",
      JSON.stringify(modifiedData_rowsToSave)
    );

    // // Check if every row has been validated
    const allRowsValidated = warriors_only.every(
      (item) => selectedRows[item.id]?.isleader_type
    );

    console.log("all rows to save 3--", JSON.stringify(allRowsValidated));

    if (!allRowsValidated) {
      alert("Please complete all rows before submitting.");
      return;
    }

    const dataToSave = {
      validated_data: modifiedData_rowsToSave,
      team_id: leader_id,
    };

    createTag(dataToSave);
    console.log("All rows are validated, data to submit:", rowsToSave);
  };

  return (
    <div className="p-12">
      {/* Title centered above the barangay */}
      <h2 className="text-3xl font-bold text-center mb-4">
        UPDATE TEAM MEMBERS TAGGING
      </h2>
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
                    Members Name
                  </th>
                  <th className="px-4 py-2 border border-gray-200 text-left">
                    Purok
                  </th>
                  <th className="px-4 py-2 border border-gray-200 text-left">
                    Precinct #
                  </th>
                  <th className="px-4 py-2 border border-gray-200 text-left">
                    Tag
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
                              selectedRows[item.id]?.isleader_type ===
                              "HOUSEHOLD HEAD"
                                ? "green"
                                : "black", // Red when DILI is selected
                          }}
                        >
                          <StyledRadioButton
                            type="radio"
                            name={`isleader_type-${item.id}`}
                            value="HOUSEHOLD HEAD" // Set the value to 1
                            checked={
                              selectedRows[item.id]?.isleader_type ===
                              "HOUSEHOLD HEAD"
                            } // Check if status is "1"
                            onChange={() =>
                              handleRadioChange(item, "HOUSEHOLD HEAD")
                            } // Pass "1" on change
                          />
                          HOUSEHOLD HEAD
                        </label>

                        {/* No Radio Button */}
                        <label
                          style={{
                            color:
                              selectedRows[item.id]?.isleader_type ===
                              "HOUSEHOLD MEMBER"
                                ? "red"
                                : "black", // Red when DILI is selected
                          }}
                        >
                          <StyledRadioButton
                            type="radio"
                            name={`isleader_type-${item.id}`}
                            value="HOUSEHOLD MEMBER"
                            checked={
                              selectedRows[item.id]?.isleader_type ===
                              "HOUSEHOLD MEMBER"
                            }
                            onChange={() =>
                              handleRadioChange(item, "HOUSEHOLD MEMBER")
                            }
                          />
                          HOUSEHOLD MEMBER
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

export default TeamViewTag;
