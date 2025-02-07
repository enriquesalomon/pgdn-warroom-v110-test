import { useForm } from "react-hook-form";
import { FaRegSave } from "react-icons/fa";
import Input from "../../../ui/Input";
import Form from "../../../ui/Form";
import Button from "../../../ui/Button";
import FormRow from "../../../ui/FormRow";
import styled from "styled-components";
import { useCreateTeam } from "../hooks/useCreateTeam";
import { useEditTeam } from "../hooks/useEditTeam";
import { leader_position } from "../../../utils/constants";
import { useActionPermissionContext } from "../../../context/ActionPermissionContext";
import Listbox from "./Listbox";
import Select, { components } from "react-select";
import { useState, useRef, useMemo } from "react";
import { useEffect } from "react";
import { insertLogs } from "../../../utils/recordUserActivity";
import { useQueryClient } from "@tanstack/react-query";
import { parseAction } from "../../../utils/helpers";
import { useSearchParams } from "react-router-dom";
import {
  useFirstSelectData,
  useGetClustered_Precinct_Electorates,
  useSecondSelectData,
} from "../hooks/useData";
import SpinnerMini from "../../../ui/SpinnerMini";
import { useFetchSettings } from "../../request/hooks/useRequest";
// import ElectoratesTable from "../../special-electorate/components/ElectoratesTable";

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "green" : "white", // Background color of each option
    color: state.isDisabled ? "green" : "black",
    width: "100%", // Width of each option
    "&:hover": {
      backgroundColor: "green", // Background color when hovering
      color: "white", // Text color when hovering
    },
  }),
};

const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  width: 19.7rem;
`;

function CreateTeamForm_v1({
  teamtoEdit = {},
  onCloseModal,
  settings,
  precint_electorates,
  precinctnoDefault,
  team_members,
}) {
  const { data: ValidationSettings } = useFetchSettings();
  console.log(
    "ValidationSettingssss-----x",
    JSON.stringify(ValidationSettings)
  );
  const queryClient = useQueryClient();
  const [selectedFirst, setSelectedFirst] = useState(null);
  const [selectedSecond, setSelectedSecond] = useState(null);
  const [selectedPrecintMember, setSelectedPrecintMember] = useState(null);
  const [selectedElectorates, setSelectedElectoratesMember] = useState([]);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [towerElectorateID, setTowerElectorateID] = useState(null);
  const prevSelectedElectoratesRef = useRef([]);
  const [clustered_precincts, setClustered_precincts] = useState(null);
  const [towerPrecinct, setTowerPrecinct] = useState(null);
  // const { data: ValidationSettings } = useFetchSettings();
  const { data, isLoading: firstLoading, error } = useFirstSelectData();
  const { data: secondData, isLoading: secondLoading } = useSecondSelectData(
    selectedFirst?.value
  );
  const { data: clustered_Electorates, isLoading: clusteredLoading } =
    useGetClustered_Precinct_Electorates(selectedPrecintMember?.value);
  console.log("first data data", JSON.stringify(data));
  const firstData = data?.data || [];
  // const data_clustered = data?.data_clustered || [];
  const data_clustered = useMemo(
    () => data?.data_clustered || [],
    [data?.data_clustered]
  );

  console.log(
    "clustered electorates-----",
    JSON.stringify(clustered_Electorates)
  );
  const { max_teammembers_included_leader } = settings;
  const { isCreating, createTeam } = useCreateTeam();
  const { isEditing, editTeam } = useEditTeam(precinctnoDefault);

  const { actionPermission } = useActionPermissionContext();
  const [searchParams] = useSearchParams();
  const handleKeyDown = (event) => {
    if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
    }
  };
  const MultiValueRemove = (props) => {
    // if (props.data.isFixed) {
    //   return null;
    // }

    const disabledIds = [towerElectorateID]; // Add the ids for which you want to disable the remove button

    if (disabledIds.includes(props.data.value.id)) {
      return null; // This will hide the remove button for the specified ids in Add Team Session
    }

    if (disabledIds.includes(props.data.value)) {
      return null; // This will hide the remove button for the specified ids in EditSession
    }

    return <components.MultiValueRemove {...props} />;
  };

  let isAllowedAction = parseAction(actionPermission, "update team");
  if (!isAllowedAction)
    isAllowedAction = parseAction(actionPermission, "add team");

  const brgy = searchParams.get("sortBy");

  const isWorking = isCreating || isEditing;
  const { id: editId, ...editValues } = teamtoEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState, setValue } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const [val_id, setVal_id] = useState(null);
  const { errors } = formState;

  useEffect(() => {
    if (isEditSession) {
      const towerPrecinct = editValues.precinctno;
      setTowerPrecinct(towerPrecinct);
    }
  }, [editValues.precinctno, isEditSession]);

  useEffect(() => {
    if (isEditSession) {
      setTowerElectorateID(teamtoEdit.electorate_id);
      let filteredData = [];
      // Ensure team_members is defined and is an array
      if (Array.isArray(team_members)) {
        // Extracting the members_name
        const membersNames = team_members.flatMap(
          (item) => item.members_name || []
        );

        filteredData = membersNames.map((leader) => ({
          value: leader.id,
          label: leader.label,
        }));

        //load list of clustered electorates in dropdown list of team options

        const cluster_number = data_clustered.find(
          (item) => item.precinct === towerPrecinct
        );
        const clustered_precincts = data_clustered
          .filter(
            (item) => item.cluster_number === cluster_number?.cluster_number
          )
          .map((item) => item.precinct);
        setClustered_precincts(clustered_precincts);
      } else {
        console.error("team_members is not defined or not an array");
      }

      setSelectedElectoratesMember(filteredData);
    }
  }, [
    isEditSession,
    editId,
    teamtoEdit.electorate_id,
    secondData,
    team_members,
    towerElectorateID,
    setValue,
    data_clustered,
    towerPrecinct,
  ]);

  let electorates_list;
  let clustered_electorates_list;
  if (!isEditing) {
    electorates_list = secondData?.map((leader) => ({
      value: leader,
      label: `${leader.precinctno} ${leader.firstname} ${leader.middlename} ${
        leader.lastname
      } ${leader?.name_ext ? leader.name_ext : ""} ${
        leader.precinctleader !== null
          ? leader.isleader
            ? "-TOWER " + leader.precinctleader
            : "-MEMBER " + leader.precinctleader
          : ""
      }`,

      isDisabled: leader.precinctleader !== null || leader.isleader === true,
    }));

    // removing the object match to the tower electorateId
    const updatedData_clustered_Electorates = clustered_Electorates?.filter(
      (item) => item.id !== towerElectorateID
    );

    clustered_electorates_list = updatedData_clustered_Electorates?.map(
      (leader) => ({
        value: leader,
        label: `${leader.precinctno} ${leader.firstname} ${leader.middlename} ${
          leader.lastname
        } ${leader?.name_ext ? leader.name_ext : ""} ${
          leader.precinctleader !== null
            ? leader.isleader
              ? "-TOWER " + leader.precinctleader
              : "-MEMBER " + leader.precinctleader
            : ""
        }`,

        isDisabled: leader.precinctleader !== null || leader.isleader === true,
      })
    );
  }

  const handleChangeLeader = (selectedElectorate) => {
    const tower_precinctValue = selectedElectorate.value.precinctno;
    const cluster_number = data_clustered.find(
      (item) => item.precinct === tower_precinctValue
    );

    // Filter by cluster_number 3 and map to extract precinct values
    const clustered_precincts = data_clustered
      .filter((item) => item.cluster_number === cluster_number.cluster_number)
      .map((item) => item.precinct);

    setClustered_precincts(clustered_precincts);
    console.log("thi is x", JSON.stringify(data_clustered));
    if (selectedElectorate.value.precinctleader !== null) {
      alert("Electorate is already assigned in a Team.");
    } else {
      // setSelectedLeader(selectedElectorate);
      if (selectedElectorate) {
        const { id, precinctno, firstname, lastname, brgy, purok } =
          selectedElectorate.value;
        setValue("precinctno", precinctno);
        setValue("firstname", firstname);
        setValue("lastname", lastname);
        setValue("barangay", brgy);
        setValue("purok", purok);
        setValue("electorate_id", id);
        setTowerElectorateID(id);

        const Tower = selectedElectorate;
        const Member = selectedElectorates;

        setSelectedElectoratesMember(Member);
        const exists = Member.some((item) => item.value.id === Tower.value.id);

        if (!exists) {
          Member.unshift(Tower);
        }
      }
    }
  };
  const handleFirstChange = (selectedOption) => {
    setSelectedFirst(selectedOption);
    setSelectedSecond(null); // Reset second select when first select changes
  };

  const handlePrecinctMembers = (selectedOption) => {
    setSelectedPrecintMember(selectedOption);
  };
  // Function to handle selection change
  const handleChangeMember = (selectedOptions) => {
    // Remove duplicates by checking the unique 'id' field
    if (isEditing) {
      selectedOptions = selectedOptions.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.value.id === item.value.id)
      );
    }

    // Check if more than 8 members selected
    if (selectedOptions.length > max_teammembers_included_leader) {
      alert(
        "You can only select up to " +
          (max_teammembers_included_leader - 1) +
          " Team Members."
      );
      return;
    }
    // Compare previous and current selections to find removed item
    const removedItem = prevSelectedElectoratesRef.current.find(
      (option) => !selectedOptions.includes(option)
    );
    if (removedItem) {
    }
    setSelectedElectoratesMember(selectedOptions);
    console.log("Selected Member", JSON.stringify(selectedOptions));
  };

  function getRemoveMembers(toEditMembers) {
    // const memberIds = selectedElectorates.map((member) => member.value.id);
    const memberIds = selectedElectorates.map((member) => {
      if (member.value && typeof member.value === "object") {
        return member.value.id;
      }
      return member.value;
    });
    const array1 = JSON.parse(toEditMembers);
    const array2 = memberIds;
    const unfoundValues = array1.filter((value) => !array2.includes(value));
    return unfoundValues;
  }

  function getNewMembers_inEdit(newMembers) {
    // const memberIds = selectedElectorates.map((member) => member.value.id);
    const memberIds = selectedElectorates.map((member) => {
      if (member.value && typeof member.value === "object") {
        return member.value.id;
      }
      return member.value;
    });
    const array1 = JSON.parse(newMembers);
    const array2 = memberIds;
    const notFoundInArray1 = array2.filter((value) => !array1.includes(value));
    return notFoundInArray1;
  }
  console.log("ValidationSettings", JSON.stringify(ValidationSettings));
  // useEffect(() => {
  //   if (ValidationSettings.ValidationSettings?.length > 0)
  //     setVal_id(ValidationSettings.ValidationSettings[0].id);
  // }, [ValidationSettings]);

  useEffect(() => {
    if (ValidationSettings && ValidationSettings.length > 0) {
      setVal_id(ValidationSettings[0].id); // Set the id from the first object in the array
    }
  }, [ValidationSettings]); // The effect will run when `data` changes

  function onSubmit(data) {
    const userData = queryClient.getQueryData(["user"]);
    const action = !isEditSession
      ? "User created a new teams information"
      : "User updated teams information";
    const params = {
      page: "Teams",
      action: action,
      parameters: data,
      user_id: userData.id,
    };

    const members_list = selectedElectorates.map((item) => {
      return {
        id:
          typeof item.value === "object" && item.value !== null
            ? item.value.id
            : item.value,
        label: item.label,
      };
      // return {
      //   id: item.value.id,
      //   label: item.label,
      // };
    });

    let removeid_members = [];
    let new_membersId = [];
    if (isEditSession) {
      removeid_members = getRemoveMembers(teamtoEdit.members);
      new_membersId = getNewMembers_inEdit(teamtoEdit.members);
    }

    if (selectedElectorates.length === 0) {
      alert("Please add member at least one electorate.");
      return null; // Set error message if no options are selected
    }

    // const memberIds = selectedElectorates.map((member) => member.value.id);
    const memberIds = selectedElectorates.map((member) => {
      if (member.value && typeof member.value === "object") {
        return member.value.id;
      }
      return member.value;
    });

    let updatedMemberIds = memberIds.includes(data.electorate_id)
      ? memberIds // If leader_id exists in memberIds, don't add it again
      : [...memberIds, data.electorate_id]; // Otherwise, add leader_id to memberIds
    // Use Set to remove duplicates
    updatedMemberIds = [...new Set(updatedMemberIds)];

    const team_validation_columnToUpdate = `is_validated${val_id}`;
    if (isEditSession)
      editTeam(
        {
          newLeaderData: {
            ...data,
            members: memberIds,
            members_name: members_list,
            val_id: val_id,
            [team_validation_columnToUpdate]: true,
            added_by: userData.email,
          },
          id: editId,
          deleteMembersid: removeid_members,
          new_membersId,
        },
        {
          onSuccess: (data) => {
            queryClient.invalidateQueries({
              queryKey: ["secondSelectData"],
            });
            insertLogs(params);
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      createTeam(
        {
          ...data,
          members: updatedMemberIds,
          members_name: members_list,
          added_by: userData.email,
          val_id: val_id,
          [team_validation_columnToUpdate]: true,
          clustered_precinct: clustered_precincts,
        },
        {
          onSuccess: (data) => {
            insertLogs(params);
            reset();
            onCloseModal?.();
          },
        }
      );

    console.log("Clustered precinct", clustered_precincts);
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
      style={{ width: "100%" }}
      className="border-2 border-gray-100 p-4 mt-4"
    >
      <div className="mb-5 flex text-m font-semibold">
        {isEditSession ? "EDIT TEAM" : "ADD NEW TEAM"}
      </div>

      <div className="text-m font-semibold border-solid mb-5 p-7">
        <div className="mb-10 flex justify-start text-4xl">
          BRGY. {brgy}
          {teamtoEdit.id && (
            <>
              <div className="mb-5 flex justify-center text-4xl">
                -TEAM ID: {teamtoEdit.id}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className=" p-4 border-2 border-gray-100 ">
          <div className=" mb-4">PRECINCT LEADER</div>
          <FormRow label="Select Precinct" error={errors?.electorate?.message}>
            <Select
              id="precinct_no"
              isLoading={firstLoading}
              options={firstData?.map((item) => ({
                value: item.precinct_no,
                label: item.precinct_no,
              }))}
              onChange={handleFirstChange}
              value={selectedFirst}
              isDisabled={isEditSession || isWorking}
              styles={customStyles}
            />
          </FormRow>

          <FormRow
            // customGridText={true}
            label="Select Leader"
            error={errors?.electorate?.message}
          >
            <Select
              isLoading={secondLoading}
              options={electorates_list}
              onChange={(setSelectedSecond, handleChangeLeader)}
              value={selectedSecond}
              styles={customStyles}
              isDisabled={isEditSession || isWorking}
            />
          </FormRow>
          <FormRow
            label="Electorate No."
            error={errors?.electorate_id?.message}
          >
            <Input
              type="text"
              id="electorate_id"
              disabled
              {...register("electorate_id", {
                required: "This field is required",
              })}
            />
          </FormRow>
          <FormRow label="Precint No." error={errors?.precinctno?.message}>
            <Input
              type="text"
              id="precinctno"
              disabled
              {...register("precinctno", {
                required: "This field is required",
              })}
            />
          </FormRow>
          <FormRow label="Firstname" error={errors?.firstname?.message}>
            <Input
              type="text"
              id="firstname"
              disabled
              {...register("firstname", {
                required: "This field is required",
              })}
            />
          </FormRow>
          <FormRow label="Lastname" error={errors?.lastname?.message}>
            <Input
              type="text"
              id="lastname"
              disabled
              {...register("lastname", {
                required: "This field is required",
              })}
            />
          </FormRow>

          <FormRow label="Barangay" error={errors?.barangay?.message}>
            <Input
              type="text"
              disabled
              {...register("barangay", {
                required: "This field is required",
              })}
            />
          </FormRow>
          <FormRow label="Purok" error={errors?.purok?.message}>
            <Input
              type="text"
              {...register("purok", {
                required: "This field is required",
              })}
            />
          </FormRow>

          <FormRow label="Position" error={errors?.position?.message}>
            <StyledSelect
              disabled={isWorking}
              id="position"
              {...register("position", { required: "This field is required" })}
            >
              {leader_position.map((option, index) => (
                <option key={index} value={option}>
                  {option === "Validator" ? "LEADER" : null}
                </option>
              ))}
            </StyledSelect>
          </FormRow>
          <FormRow label="Leader Type" error={errors?.position?.message}>
            <StyledSelect
              disabled={isWorking}
              id="isleader_type"
              {...register("isleader_type", {
                required: "This field is required",
              })}
            >
              {/* <option value="">Select Type</option> */}
              <option value="SILDA LEADER">SILDA LEADER</option>
              {/* <option value="HOUSEHOLD HEAD">HOUSEHOLD HEAD</option>
              <option value="SILDA LEADER & HOUSEHOLD HEAD">
                SILDA LEADER & HOUSEHOLD HEAD
              </option> */}
            </StyledSelect>
          </FormRow>
          <FormRow label="Status" error={errors?.status?.message}>
            <StyledSelect
              disabled={isWorking}
              id="status"
              {...register("status", { required: "This field is required" })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </StyledSelect>
          </FormRow>
        </div>
        <div className="p-4  border-2 border-gray-100">
          <div className="mb-4 flex justify-center">Select Team Members</div>
          {/* <p className=" rounded-md bg-yellow-100 p-2 text-md text-black text-center">
            Please Include the Team Leader
          </p> */}
          <FormRow label="Select Precinct" error={errors?.electorate?.message}>
            <Select
              id="precinct_no"
              isLoading={firstLoading}
              // options={clustered_precincts?.map((precinct) => ({
              //   value: precinct, // Set the value of the option
              //   label: precinct, // Set the label of the option
              // }))}
              options={firstData?.map((item) => ({
                value: item.precinct_no,
                label: item.precinct_no,
              }))}
              onChange={handlePrecinctMembers}
              value={selectedPrecintMember}
              // isDisabled={isEditSession || isWorking}
              styles={customStyles}
            />
          </FormRow>
          <FormRow
            customGridText={true}
            label={``}
            error={errors?.selectedElectorates?.message}
          >
            <Select
              id="selectedElectorates"
              className="text-2xl "
              isMulti
              value={selectedElectorates}
              onChange={(setSelectedSecond, handleChangeMember)}
              isLoading={clusteredLoading}
              options={clustered_electorates_list}
              isEditSession
              styles={customStyles}
              components={{ MultiValueRemove }}
              onKeyDown={handleKeyDown} // Custom onKeyDown handler
              isClearable={false}
            />
          </FormRow>
          <div className="mt-8">
            <Listbox
              isEditSession={isEditSession}
              tower_id={towerElectorateID}
              selectedWarriors_Tower={selectedElectorates}
              max={max_teammembers_included_leader}
            />{" "}
          </div>
          <div className="flex justify-center p-6 mt-4 items-center">
            <div className="mr-3">
              <Button
                isabled={isWorking}
                variation="secondary"
                type="reset"
                onClick={() => onCloseModal?.()}
              >
                Cancel
              </Button>
            </div>
            <div>
              {isAllowedAction ? (
                <Button disabled={isWorking}>
                  <div className="flex justify-center items-center">
                    {!isWorking ? (
                      <FaRegSave className="mr-2" />
                    ) : (
                      <SpinnerMini />
                    )}

                    {isEditSession ? "Edit Team" : "Create new Team"}
                  </div>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}

export default CreateTeamForm_v1;
