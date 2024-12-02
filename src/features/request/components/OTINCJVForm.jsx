import { useForm } from "react-hook-form";
import Form from "../../../ui/Form";
import Button from "../../../ui/Button";
import styled from "styled-components";
import { useActionPermissionContext } from "../../../context/ActionPermissionContext";
import Listbox from "./Listbox";
import { components } from "react-select";
import { useState } from "react";
import { useEffect } from "react";
import { insertLogs } from "../../../utils/recordUserActivity";
import { useQueryClient } from "@tanstack/react-query";
import { parseAction } from "../../../utils/helpers";

import SpinnerMini from "../../../ui/SpinnerMini";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useFetchMembersName, useFetchSettings } from "../hooks/useRequest";
import { useDisapproveTeam } from "../hooks/useDisapproveRequest";
import { useApproveMember_Remarks } from "../hooks/useApproveTeam";
import { FaRegCircleCheck } from "react-icons/fa6";
import Textarea from "../../../ui/Textarea";
import FormRowVertical from "../../../ui/FormRowVertical";
const StyledBookingDataBox = styled.section`
  /* Box */
  background-color: var(--color-orange-500);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 1rem 2rem;
  margin-bottom: 1rem;

  overflow: hidden;
`;
const MultiValueRemove = (props) => {
  if (props.data.isFixed) {
    return null;
  }
  return <components.MultiValueRemove {...props} />;
};

const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  width: 19.7rem;
`;

function OTINCJVForm({
  teamtoEdit = {},
  onCloseModal,
  baco,
  request_status,
  request_type,
}) {
  const queryClient = useQueryClient();

  const { data: team_members, isPending } = useFetchMembersName(
    teamtoEdit.members_name,
    teamtoEdit.electorate_id
  );
  const { data: ValidationSettings } = useFetchSettings();

  const { isCreating, approveMembers } = useApproveMember_Remarks();
  const { isCreating2, disapproveTeam } = useDisapproveTeam();

  const [selectedElectorates, setSelectedElectoratesMember] = useState([]);

  const { id: editId, ...editValues } = teamtoEdit;
  const isEditSession = Boolean(editId);
  const { register, handleSubmit, reset, formState, watch } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const remarks = watch("remarks", "");
  const isWorking = isCreating || isCreating2;
  const [actionType, setActionType] = useState("");
  const [showRemarks, setShowRemarks] = useState(false);
  const [val_id, setVal_id] = useState();
  const { errors } = formState;

  const { actionPermission } = useActionPermissionContext();
  let isAllowedAction = parseAction(actionPermission, "team request approval");

  const handleDisapproveClick = () => {
    setShowRemarks(true);
  };
  const handleCancelDisapprove = () => {
    setShowRemarks(false);
  };

  useEffect(() => {
    if (ValidationSettings?.length > 0) setVal_id(ValidationSettings[0].id);
  }, [ValidationSettings]);

  useEffect(() => {
    if (isEditSession && team_members) {
      //displayonly the member to be remove
      const idsToMatch = teamtoEdit.members;

      // Filter data1 to only include entries with matching IDs
      const mem_to_remove = team_members.filter((item) =>
        idsToMatch.includes(item.id)
      );
      // Ensure team_members is defined and is an array
      let delistMemberName = [];
      if (Array.isArray(mem_to_remove)) {
        // Extracting and formatting the members_name
        delistMemberName = mem_to_remove.map((member) => ({
          value: member.id,
          label: `${member.precinctno} ${member.firstname} ${member.middlename} ${member.lastname}`,
        }));
      } else {
        console.error("team_members is not defined or not an array");
      }

      setSelectedElectoratesMember(delistMemberName);
    }
  }, [isEditSession, team_members, teamtoEdit.members]);

  function onSubmit(data) {
    if (selectedElectorates.length === 0) {
      alert("Please add member at least one electorate.");
      return null; // Set error message if no options are selected
    }

    const userData = queryClient.getQueryData(["user"]);

    const content =
      request_type === "OUT OF TOWN"
        ? "Out of Town Member Tagging Request"
        : request_type === "INC"
        ? "INC Member Tagging Request"
        : request_type === "JEHOVAH"
        ? "Jehovah Member Tagging Request"
        : "";

    const action =
      actionType === "disapprove"
        ? "User disapproved a team delisting request"
        : "User approved a team delisting request";
    const params = {
      page: content,
      action: action,
      parameters: data,
      user_id: userData.id,
    };

    if (actionType === "disapprove") {
      disapproveTeam(
        {
          editData: {
            ...data,
            added_by: userData.email,
            request_type: request_type,
            content: content,
          },
          id: editId,
        },
        {
          onSuccess: (data) => {
            insertLogs(params);
            reset();
            onCloseModal?.();
          },
        }
      );
    } else if (actionType === "approve") {
      approveMembers(
        {
          ...data,
          id: editId,
          baco_id: teamtoEdit.baco_id,
          added_by: userData.email,
          request_type: request_type,
          members_id_toremove: teamtoEdit.members,
          content: content,
          val_id: val_id,
          barangay: teamtoEdit.barangay,
        },
        {
          onSuccess: (data) => {
            insertLogs(params);
            reset();
            onCloseModal?.();
          },
        }
      );
    }
  }

  function onError(errors) {
    console.log(errors);
  }
  const action_type =
    request_type === "OUT OF TOWN"
      ? "OUT OF TOWN MEMBER - TAGGING REQUEST"
      : request_type === "INC"
      ? "IGLESIA NI CRISTO MEMBER - TAGGING REQUEST"
      : request_type === "JEHOVAH"
      ? "JEHOVAH MEMBER - TAGGING REQUEST"
      : "";

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
      style={{ width: "100%" }}
    >
      <div className="mb-3  text-2xl font-semibold">{action_type}</div>
      <div
        className={`bg-[#FFA500] shadow-lg rounded-xl ${
          request_status === "DISAPPROVED"
            ? "shadow-red-800/50"
            : request_status === "APPROVED"
            ? "shadow-green-800/50"
            : request_status === "PENDING"
            ? "shadow-orange-800/50"
            : ""
        }`}
      >
        <StyledBookingDataBox>
          <div className="flex">
            <div className="flex-1 w-64 ...">
              <div className="flex justify-left text-white">
                REQUESTOR:
                {baco && (
                  <>
                    <div className=" flex justify-center  ml-3">
                      {baco.firstname} {baco.middlename} {baco.lastname}{" "}
                      {"(BACO)"}
                    </div>
                  </>
                )}
              </div>

              <div className=" text-white flex justify-left ">
                REQUEST CODE:
                {editValues && (
                  <>
                    <div className="flex justify-center  ml-3">
                      {editValues.request_code}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 w-32 flex justify-end">
              <div
                className={`border-2 border-white text-white flex items-center justify-center mt-2 text-4xl p-4 rounded-full ${
                  request_status === "PENDING"
                    ? "bg-yellow-400"
                    : request_status === "APPROVED"
                    ? "bg-green-900"
                    : request_status === "DISAPPROVED"
                    ? "bg-red-700"
                    : ""
                }`}
              >
                <FaRegCircleCheck className="mr-2" />
                {request_status}
              </div>
            </div>
          </div>
        </StyledBookingDataBox>
      </div>
      <div className="flex justify-center">
        <div className="w-full">
          {!isPending ? (
            <div className="p-4  border-2 border-gray-100">
              <div className="mb-4 flex justify-center">
                {request_status === "APPROVED" ? "Electorates" : "Electorates"}
              </div>

              <div className="mt-8">
                <Listbox selectedElectorates={selectedElectorates} />
              </div>

              {!showRemarks ? (
                <>
                  <div className="flex justify-center p-6 mt-4 items-center">
                    <div className="mr-3">
                      {request_status === "PENDING" ? (
                        <Button
                          variation="danger"
                          disabled={isCreating2 || isCreating}
                          onClick={handleDisapproveClick}
                        >
                          <div className="flex justify-center items-center">
                            {!isCreating2 ? (
                              <IoMdCloseCircleOutline className="mr-2" />
                            ) : (
                              <SpinnerMini />
                            )}
                            Disapprove
                          </div>
                        </Button>
                      ) : null}
                    </div>
                    <div>
                      {isAllowedAction && request_status === "PENDING" ? (
                        <Button
                          disabled={isCreating}
                          onClick={() => setActionType("approve")}
                        >
                          <div className="flex justify-center items-center">
                            {!isCreating ? (
                              <FaRegCheckCircle className="mr-2" />
                            ) : (
                              <SpinnerMini />
                            )}

                            {isEditSession ? "Approve" : "Create new Team"}
                          </div>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <FormRowVertical
                    label="Reason of disapproval"
                    error={errors?.remarks?.message}
                  >
                    <Textarea
                      type="text"
                      id="remarks"
                      defaultValue=""
                      {...register("remarks", {
                        required: "This field is required",
                        minLength: {
                          value: 25,
                          message: "Remarks needs a minimum of 25 characters",
                        },
                        maxLength: {
                          value: 200,
                          message: "Remarks must be at most 200 characters",
                        },
                      })}
                    />
                  </FormRowVertical>
                  <small>{remarks.length} / 200 characters</small>
                  <div className="flex flex-col items-center">
                    <div className="row flex gap-4">
                      <Button
                        disabled={isCreating2}
                        variation="secondary"
                        onClick={handleCancelDisapprove}
                      >
                        <div className="flex justify-center items-center">
                          Cancel
                        </div>
                      </Button>

                      <Button
                        type="submit"
                        variation="danger"
                        disabled={isCreating2 || remarks.length > 200}
                        onClick={() => setActionType("disapprove")}
                      >
                        <div className="flex justify-center items-center">
                          {!isCreating2 ? (
                            <IoMdCloseCircleOutline className="mr-2" />
                          ) : (
                            <SpinnerMini />
                          )}
                          Submit Disapproval
                        </div>
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                Fetching Members...
                <SpinnerMini />
              </div>
            </>
          )}
        </div>
      </div>
    </Form>
  );
}

export default OTINCJVForm;
