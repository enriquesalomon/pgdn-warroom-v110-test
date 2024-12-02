import { useForm } from "react-hook-form";
import Input from "../../../ui/Input";
import Form from "../../../ui/Form";
import Button from "../../../ui/Button";
import FormRow from "../../../ui/FormRow";
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
import {
  useFetchMembersName,
  useFetchOriginalMembers,
  useFetchSettings,
  useFetchTeamData,
} from "../hooks/useRequest";
import { useDisapproveTeam } from "../hooks/useDisapproveRequest";
import { useApproveTeam_listing } from "../hooks/useApproveTeam";
import { FaRegCircleCheck } from "react-icons/fa6";
import Textarea from "../../../ui/Textarea";
import FormRowVertical from "../../../ui/FormRowVertical";
import { MdOutlinePendingActions } from "react-icons/md";
import {
  useAGM,
  useBacoName,
  useElite,
  useGM,
  useLegend,
} from "../hooks/useData";
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

function ListingTeamForm({
  teamtoEdit = {},
  onCloseModal,
  baco,
  request_status,
  request_type,
}) {
  const queryClient = useQueryClient();
  const { data: team_members, isPending } = useFetchMembersName(
    teamtoEdit.members_name
  );
  const { data: ValidationSettings } = useFetchSettings();
  const { data: team_data, isPending: isPending1 } = useFetchTeamData(
    teamtoEdit.electorate_id
  );

  const { data: original_members, isPending: isPending2 } =
    useFetchOriginalMembers(
      team_data && team_data.length > 0 ? team_data[0].id : null
    );

  const { isCreating, approveTeam } = useApproveTeam_listing();
  const { isCreating2, disapproveTeam } = useDisapproveTeam();

  const [selectedElectorates, setSelectedElectoratesMember] = useState([]);
  const [hasTeam, setHasTeam] = useState(false);

  const { id: editId, ...editValues } = teamtoEdit;
  const isEditSession = Boolean(editId);
  const { register, handleSubmit, reset, formState, watch, setValue } = useForm(
    {
      defaultValues: isEditSession ? editValues : {},
    }
  );

  const remarks = watch("remarks", "");
  const [actionType, setActionType] = useState("");
  const [showRemarks, setShowRemarks] = useState(false);
  const [val_id, setVal_id] = useState();
  const { errors } = formState;

  const { data: gmData } = useGM(teamtoEdit.gm_id);
  const { data: agmData } = useAGM(teamtoEdit.agm_id);
  const { data: legendData } = useLegend(teamtoEdit.legend_id);
  const { data: eliteData } = useElite(teamtoEdit.elite_id);
  const { data: bacoData } = useBacoName(teamtoEdit.baco_id);

  const { actionPermission } = useActionPermissionContext();
  let isAllowedAction = parseAction(actionPermission, "team request approval");

  useEffect(() => {
    function allDataLoaded() {
      return (
        gmData?.length &&
        agmData?.length &&
        legendData?.length &&
        eliteData?.length &&
        bacoData?.length
      );
    }
    if (isEditSession && allDataLoaded()) {
      const setFullName = (data, fieldName) => {
        setValue(
          fieldName,
          data[0]?.firstname +
            " " +
            data[0]?.middlename +
            " " +
            data[0]?.lastname
        );
      };
      const setPrecinctNo = (data, fieldName) => {
        setValue(fieldName, data[0]?.precinctno);
      };
      setFullName(gmData, "gm_name");
      setFullName(agmData, "agm_name");
      setFullName(legendData, "legend_name");
      setFullName(eliteData, "elite_name");
      setFullName(bacoData, "baco_name");
      setPrecinctNo(legendData, "legend_precinctno");
      setPrecinctNo(eliteData, "elite_precinctno");
    }
  }, [
    isEditSession,
    gmData,
    agmData,
    legendData,
    eliteData,
    bacoData,
    setValue,
  ]);

  useEffect(() => {
    if (team_data?.length > 0) {
      if (!hasTeam) {
        setHasTeam(true);
      }
    } else {
      if (hasTeam) {
        setHasTeam(false);
      }
    }
  }, [team_data, hasTeam]);

  useEffect(() => {
    if (ValidationSettings?.length > 0) setVal_id(ValidationSettings[0].id);
  }, [ValidationSettings]);

  const handleDisapproveClick = () => {
    setShowRemarks(true);
  };
  const handleCancelDisapprove = () => {
    setShowRemarks(false);
  };
  useEffect(() => {
    if (isEditSession && team_members) {
      //displayonly the member to be add
      const idsToMatch = teamtoEdit.members;

      // Filter data1 to only include entries with matching IDs
      const mem_to_add = team_members.filter((item) =>
        idsToMatch.includes(item.id)
      );
      // Ensure team_members is defined and is an array
      let addMemberName = [];
      if (Array.isArray(mem_to_add)) {
        // Extracting and formatting the members_name
        addMemberName = mem_to_add.map((member) => ({
          value: member.id,
          label: `${member.precinctno} ${member.firstname} ${member.middlename} ${member.lastname}`,
        }));
      } else {
        console.error("team_members is not defined or not an array");
      }

      setSelectedElectoratesMember(addMemberName);
    }
  }, [isEditSession, team_members, teamtoEdit.members]);

  function onSubmit(data) {
    if (selectedElectorates.length === 0) {
      alert("Please add member at least one electorate.");
      return null; // Set error message if no options are selected
    }

    const userData = queryClient.getQueryData(["user"]);
    const action =
      actionType === "disapprove"
        ? "User disapproved a team listing request"
        : "User approved a team listing request";
    const params = {
      page: "Team Listing Request",
      action: action,
      parameters: data,
      user_id: userData.id,
    };

    const team_id = team_data.map((item) => item.id);
    // const updated_members = [...original_members, ...team_members];
    const updated_members = [
      ...(Array.isArray(original_members) ? original_members : []),
      ...team_members,
    ];
    const final_members_id = updated_members.map((item) => item.id);
    const final_members_name = updated_members.map((item) => ({
      id: item.id,
      label: `${item.precinctno} ${item.firstname} ${item.middlename} ${item.lastname}`,
    }));

    if (actionType === "disapprove") {
      disapproveTeam(
        {
          editData: {
            ...data,
            added_by: userData.email,
            request_type: request_type,
            content: "Team Member Listing",
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
      approveTeam(
        {
          ...data,
          id: editId,
          members: final_members_id,
          baco_id: teamtoEdit.baco_id,
          members_name: final_members_name,
          added_by: userData.email,
          request_type: request_type,
          team_id: team_id,
          members_id_toadd: teamtoEdit.members,
          content: "Team Member Listing",
          val_id: val_id,
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
    request_type === "ADD"
      ? "Team Creation Request"
      : request_type === "DELISTING"
      ? "Team Delisting Request"
      : request_type === "LISTING"
      ? "Team Listing Request"
      : "";

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
      style={{ width: "100%" }}
    >
      <div className="mb-3  text-2xl font-semibold">{action_type}</div>
      <div
        className={` rounded-xl ${
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
          <div className="flex ">
            <div className="font-medium flex-1 text-white mt-2">
              <div className="flex flex-row ">
                <div className="w-64"> REQUESTOR:</div>
                <div className="basis-1/6  ml-6">
                  {baco.firstname} {baco.middlename} {baco.lastname} {"(BACO)"}
                </div>
                {/* <div class="justify-end">03</div> */}
              </div>
              <div className="flex flex-row">
                <div className="w-64"> REQUEST CODE:</div>
                <div className="basis-1/6  ml-6">{editValues.request_code}</div>
              </div>
            </div>
            <div className=" ml-auto">
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

      <hr />
      <div className="text-m font-semibold border-solid mb-5 p-7">
        <div className="mb-10 flex justify-start text-xl">
          BRGY. {teamtoEdit.barangay}
          {/* {teamtoEdit.id && (
            <>
              <div className="mb-5 flex justify-center text-4xl">
                -TEAM ID: {teamtoEdit.id}
              </div>
            </>
          )} */}
        </div>

        <div className="my-2">
          <FormRow label="BACO" error={errors?.baco_name?.message}>
            <Input
              width={"42%"}
              type="text"
              id="baco_name"
              disabled
              {...register("baco_name", {
                required: "This field is required",
              })}
            />
          </FormRow>
        </div>

        <div className="my-2">
          <FormRow label="GRAND MASTER" error={errors?.gm_name?.message}>
            <Input
              width={"42%"}
              type="text"
              id="gm_name"
              disabled
              {...register("gm_name", {
                required: "This field is required",
              })}
            />
          </FormRow>
        </div>

        <div className="my-2">
          <FormRow
            label="ASSISTANT GRAND MASTER"
            error={errors?.agm_name?.message}
          >
            <Input
              width={"42%"}
              type="text"
              id="agm_name"
              disabled
              {...register("agm_name", {
                required: "This field is required",
              })}
            />
          </FormRow>
        </div>
        <div className="my-2 flex space-x-0">
          <div>
            <FormRow label="LEGEND" error={errors?.legend_name?.message}>
              <Input
                width={"158%"}
                type="text"
                id="legend_name"
                disabled
                {...register("legend_name", {
                  required: "This field is required",
                })}
              />
            </FormRow>
          </div>
          <div className="flex-1">
            <Input
              width={"10%"}
              type="text"
              id="legend_precinctno"
              disabled
              {...register("legend_precinctno", {
                required: "This field is required",
              })}
            />
          </div>
        </div>
        <div className="my-2 flex space-x-0">
          <div>
            <FormRow label="ELITE" error={errors?.elite_name?.message}>
              <Input
                width={"158%"}
                type="text"
                id="elite_name"
                disabled
                {...register("elite_name", {
                  required: "This field is required",
                })}
              />
            </FormRow>
          </div>
          <div className="flex-1">
            <Input
              width={"10%"}
              type="text"
              id="elite_precinctno"
              disabled
              {...register("legend_precinctno", {
                required: "This field is required",
              })}
            />
          </div>
        </div>
      </div>
      <hr />
      <div className="grid md:grid-cols-2 gap-4">
        <div className=" p-4 border-2 border-gray-100 ">
          <div className=" mb-4">Team Leader</div>

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
        </div>
        {!isPending || !isPending1 || isPending2 ? (
          <div className="p-4  border-2 border-gray-100">
            <div className="mb-4 flex justify-center">
              {request_status === "APPROVED"
                ? "Listed Members"
                : "Members to be listed"}
            </div>

            <div className="mt-8">
              <Listbox
                selectedElectorates={selectedElectorates}
                // max={max_teammembers_included_leader}
              />
            </div>

            {!showRemarks ? (
              <>
                <div className="flex justify-center p-6 mt-4 items-center">
                  <div className="mr-3">
                    {request_status === "PENDING" && isAllowedAction ? (
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
                        disabled={isCreating || !hasTeam}
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
                {!hasTeam && (
                  <div className="bg-yellow-200 text-yellow-800 p-4 rounded-md shadow-md mb-4 mx-8 mt-4">
                    <p className="text-md text-center">
                      "Info: Only Towers with an existing team are valid to add
                      another member. The selected team has not been created
                      yet, so the request cannot be approved at this time.
                      Please proceed with the other request."
                    </p>
                  </div>
                )}
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
    </Form>
  );
}

export default ListingTeamForm;
