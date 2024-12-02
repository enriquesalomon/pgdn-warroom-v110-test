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
import { useState, useRef } from "react";
import { useEffect } from "react";
import { insertLogs } from "../../../utils/recordUserActivity";
import { useQueryClient } from "@tanstack/react-query";
import { parseAction } from "../../../utils/helpers";
import { useSearchParams } from "react-router-dom";
import { useFirstSelectData, useSecondSelectData } from "../hooks/useData";
import Heading from "../../../ui/Heading";
import SpinnerMini from "../../../ui/SpinnerMini";

const MultiValueRemove = (props) => {
  if (props.data.isFixed) {
    return null;
  }
  return <components.MultiValueRemove {...props} />;
};
const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "orange" : "white", // Background color of each option
    color: state.isDisabled ? "orange" : "black",
    width: "100%", // Width of each option
    "&:hover": {
      backgroundColor: "orange", // Background color when hovering
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

function CreateTeamForm({
  teamtoEdit = {},
  onCloseModal,
  settings,
  precint_electorates,
  precinctnoDefault,
}) {
  const queryClient = useQueryClient();
  const [selectedFirst, setSelectedFirst] = useState(null);
  const [selectedSecond, setSelectedSecond] = useState(null);
  const [selectedElectorates, setSelectedElectoratesMember] = useState([]);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const prevSelectedElectoratesRef = useRef([]);

  const { data: firstData, isLoading: firstLoading } = useFirstSelectData();
  const { data: secondData, isLoading: secondLoading } = useSecondSelectData(
    selectedFirst?.value
  );
  const { max_teammembers_included_leader } = settings;
  const { isCreating, createTeam } = useCreateTeam();
  const { isEditing, editTeam } = useEditTeam(precinctnoDefault);

  const { actionPermission } = useActionPermissionContext();
  const [searchParams] = useSearchParams();

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
  const { errors } = formState;
  useEffect(() => {
    if (isEditSession) {
      let filteredData = precint_electorates?.filter(
        (item) => item.precinctleader === editId
      );
      filteredData = filteredData?.map((leader) => ({
        value: leader,
        label: `${leader.precinctno} ${leader.firstname} ${leader.middlename} ${leader.lastname}`,
        isFixed:
          leader.isleader !== true && leader.id !== teamtoEdit.electorate_id
            ? false
            : true,
      }));
      setSelectedElectoratesMember(filteredData);
    }
  }, [
    isEditSession,
    editId,
    teamtoEdit.electorate_id,
    secondData,
    precint_electorates,
    // precintno_isSelected,
  ]);

  let electorates_list;
  if (!isEditing) {
    electorates_list = secondData?.map((leader) => ({
      value: leader,
      // label: (
      //   <span className={leader.precinctleader !== null ? "line-through" : ""}>
      //     {leader.precinctno} {leader.firstname} {leader.middlename}{" "}
      //     {leader.lastname}{" "}
      //     {leader.precinctleader !== null
      //       ? leader.isleader
      //         ? "LEADER-" + leader.precinctleader
      //         : " TEAM-" + leader.precinctleader
      //       : ""}
      //   </span>
      // ),
      label: `${leader.precinctno} ${leader.firstname} ${leader.middlename} ${
        leader.lastname
      } ${
        leader.precinctleader !== null
          ? leader.isleader
            ? "LEADER-" + leader.precinctleader
            : " TEAM-" + leader.precinctleader
          : ""
      }`,

      isDisabled: leader.precinctleader !== null || leader.isleader === true,
    }));
  }

  if (precint_electorates) {
    electorates_list = precint_electorates?.map((leader) => ({
      value: leader,
      label: `${leader.precinctno}  ${leader.firstname} ${leader.middlename} ${
        leader.precinctleader !== null
          ? leader.isleader
            ? "LEADER-" + leader.precinctleader
            : " TEAM-" + leader.precinctleader
          : ""
      }`,
      isDisabled: leader.precinctleader !== null || leader.isleader === true,
    }));
  }

  const handleChangeLeader = (selectedElectorate) => {
    if (selectedElectorate.value.precinctleader !== null) {
      alert("Electorate is already assigned in a Team.");
    } else {
      setSelectedLeader(selectedElectorate);
      if (selectedElectorate) {
        const { id, precinctno, firstname, lastname, brgy } =
          selectedElectorate.value;
        setValue("precinctno", precinctno);
        setValue("firstname", firstname);
        setValue("lastname", lastname);
        setValue("barangay", brgy);
        setValue("electorate_id", id);
      }
    }
  };
  const handleFirstChange = (selectedOption) => {
    setSelectedFirst(selectedOption);
    setSelectedSecond(null); // Reset second select when first select changes
  };
  // Function to handle selection change
  const handleChangeMember = (selectedOptions) => {
    // Check if more than 8 members selected
    if (selectedOptions.length > max_teammembers_included_leader) {
      alert(
        "You can only select up to " +
          max_teammembers_included_leader +
          " Team Members included the Team Leader."
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
  };

  function getRemoveMembers(toEditMembers) {
    const memberIds = selectedElectorates.map((member) => member.value.id);
    const array1 = JSON.parse(toEditMembers);
    const array2 = memberIds;
    const unfoundValues = array1.filter((value) => !array2.includes(value));
    return unfoundValues;
  }

  function getNewMembers_inEdit(newMembers) {
    const memberIds = selectedElectorates.map((member) => member.value.id);
    const array1 = JSON.parse(newMembers);
    const array2 = memberIds;
    const notFoundInArray1 = array2.filter((value) => !array1.includes(value));
    return notFoundInArray1;
  }

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
        id: item.value.id,
        label: item.label,
      };
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

    const memberIds = selectedElectorates.map((member) => member.value.id);
    // const image = typeof data.image === "string" ? data.image : data.image[0];

    const updatedMemberIds = memberIds.includes(data.electorate_id)
      ? memberIds // If leader_id exists in memberIds, don't add it again
      : [...memberIds, data.electorate_id]; // Otherwise, add leader_id to memberIds

    if (isEditSession)
      editTeam(
        // { newLeaderData: { ...data, image }, id: editId },
        {
          newLeaderData: {
            ...data,
            members: memberIds,
            members_name: members_list,
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
          added_by: userData.id,
        },
        // { ...data, image: image, members: updatedMemberIds },
        {
          onSuccess: (data) => {
            insertLogs(params);
            reset();
            onCloseModal?.();
          },
        }
      );
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
      style={{ width: "100%" }}
    >
      <div className="mb-5 flex text-m font-semibold">
        {isEditSession ? "EDIT TEAM" : "ADD NEW TEAM"}
      </div>
      <div className="mb-5 flex justify-center text-4xl">
        BRGY. {brgy}
        {teamtoEdit.id && (
          <>
            <div className="mb-5 flex justify-center text-4xl">
              -TEAM ID: {teamtoEdit.id}
            </div>
          </>
        )}
      </div>
      <div className="mb-8 w-100 flex justify-center">
        {precinctnoDefault ? (
          <>
            <Heading as="h3"> PRECINCT #{precinctnoDefault}</Heading>
          </>
        ) : (
          <>
            <div className="flex items-center mr-5">SELECT PRECINCT</div>
            <div className="flex items-center">
              <FormRow error={errors?.electorate?.message}>
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
            </div>
          </>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className=" p-4 border-2 border-gray-100 ">
          <div className=" mb-4">Team Leader</div>

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
          <FormRow label="Contact No" error={errors?.contactno?.message}>
            <Input
              type="text"
              id="contactno"
              disabled={isWorking}
              {...register("contactno", {
                required: "This field is required",
              })}
            />
          </FormRow>
          <FormRow label="Gender" error={errors?.gender?.message}>
            <StyledSelect
              disabled={isWorking}
              id="gender"
              {...register("gender", { required: "This field is required" })}
            >
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </StyledSelect>
          </FormRow>
          <FormRow label="Position" error={errors?.position?.message}>
            <StyledSelect
              disabled={isWorking}
              id="position"
              {...register("position", { required: "This field is required" })}
            >
              {leader_position.map((option, index) => (
                <option key={index} value={option}>
                  {option === "Validator" ? "PL" : null}
                </option>
              ))}
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
          <p className=" rounded-md bg-yellow-100 p-2 text-md text-black text-center">
            Please Include the Team Leader
          </p>

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
              isLoading={secondLoading}
              options={electorates_list}
              isEditSession
              styles={customStyles}
              components={{ MultiValueRemove }}
              isClearable={false}
              isDisabled={isWorking}
            />
          </FormRow>
          <div className="mt-8">
            <Listbox
              selectedElectorates={selectedElectorates}
              max={max_teammembers_included_leader}
            />
          </div>
          <div className="flex justify-center p-6 mt-4 items-center">
            <div className="mr-3">
              <Button
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

export default CreateTeamForm;
