import { useForm } from "react-hook-form";
import Input from "../../../ui/Input";
import Form from "../../../ui/Form";
import Button from "../../../ui/Button";
import FormRow from "../../../ui/FormRow";
import styled from "styled-components";
import { leader_position } from "../../../utils/constants";
import { useActionPermissionContext } from "../../../context/ActionPermissionContext";
import Listbox from "./Listbox";
import Select, { components } from "react-select";
import { useState } from "react";
import { useEffect } from "react";
import { insertLogs } from "../../../utils/recordUserActivity";
import { useQueryClient } from "@tanstack/react-query";
import { parseAction } from "../../../utils/helpers";
import SpinnerMini from "../../../ui/SpinnerMini";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import {
  useCheckExistTeam,
  useFetchMembersName,
  useFetchSettings,
} from "../hooks/useRequest";
import { useDisapproveTeam } from "../hooks/useDisapproveRequest";
import { useApproveTeam_add } from "../hooks/useApproveTeam";
import { FaRegCircleCheck } from "react-icons/fa6";
import Textarea from "../../../ui/Textarea";
import FormRowVertical from "../../../ui/FormRowVertical";

import {
  useAGM,
  useBacoName,
  useElite,
  useGM,
  useLegend,
  useTower,
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

function CreateTeamForm({
  teamtoEdit = {},
  onCloseModal,
  baco,
  request_status,
  request_type,
}) {
  const queryClient = useQueryClient();

  const { data: team_found, isPending: isPending1 } = useCheckExistTeam(
    teamtoEdit.electorate_id
  );
  const { data: team_members, isPending } = useFetchMembersName(
    teamtoEdit.members_name,
    teamtoEdit.electorate_id
  );
  const { data: ValidationSettings } = useFetchSettings();
  const { isCreating, approveTeam } = useApproveTeam_add();
  const { isCreating2, disapproveTeam } = useDisapproveTeam();
  const { id: editId, ...editValues } = teamtoEdit;
  const isEditSession = Boolean(editId);
  const { register, handleSubmit, reset, formState, watch, setValue } = useForm(
    {
      defaultValues: isEditSession ? editValues : {},
    }
  );
  const remarks = watch("remarks", "");
  const isWorking = isCreating || isCreating2;
  const [selectedElectorates, setSelectedElectoratesMember] = useState([]);
  const [actionType, setActionType] = useState("");
  const [showRemarks, setShowRemarks] = useState(false);
  const [val_id, setVal_id] = useState();
  const [isGM_isInvalidData, setIsGM_isInvalidData] = useState(false);
  const [isAGM_isInvalidData, setIsAGM_isInvalidData] = useState(false);
  const [isLegend_isInvalidData, setIsLegend_isInvalidData] = useState(false);
  const [isElite_isInvalidData, setIsElite_isInvalidData] = useState(false);
  const [isTower_isInvalidData, setIsTower_isInvalidData] = useState(false);
  const { errors } = formState;

  const { data: gmData, isLoading: gmPending } = useGM(teamtoEdit.gm_id);
  const { data: agmData, isLoading: agmPending } = useAGM(teamtoEdit.agm_id);
  const { data: legendData, isLoading: legendPending } = useLegend(
    teamtoEdit.legend_id
  );
  const { data: eliteData, isLoading: elitePending } = useElite(
    teamtoEdit.elite_id
  );
  const { data: bacoData, isLoading: bacoPending } = useBacoName(
    teamtoEdit.baco_id
  );
  const { data: towerData, isLoading: towerPending } = useTower(
    teamtoEdit.electorate_id
  );

  const isPending_TopLeaders =
    gmPending ||
    agmPending ||
    legendPending ||
    elitePending ||
    bacoPending ||
    towerPending;

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
      let filteredData = [];

      // Ensure team_members is defined and is an array
      if (Array.isArray(team_members)) {
        // Extracting and formatting the members_name
        filteredData = team_members.map((member) => ({
          value: member.id,
          label: `${member.precinctno} ${member.firstname} ${member.middlename} ${member.lastname}`,
        }));
      } else {
        console.error("team_members is not defined or not an array");
      }

      setSelectedElectoratesMember(filteredData);
    }
  }, [isEditSession, team_members]);

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
  const isInvalidData = (data) => {
    if (!data?.length) return false;
    const item = data[0];
    return (
      item.is_gm === true ||
      item.is_agm === true ||
      item.is_legend === true ||
      item.is_elite === true ||
      item.precinctleader !== null ||
      item.voters_type !== null ||
      item.isleader === true ||
      item.isbaco === true
    );
  };

  useEffect(() => {
    if (
      gmData?.length &&
      agmData?.length &&
      legendData?.length &&
      eliteData?.length &&
      bacoData?.length &&
      towerData?.length
    ) {
      if (isInvalidData(gmData)) setIsGM_isInvalidData(true);
      if (isInvalidData(agmData)) setIsAGM_isInvalidData(true);
      if (isInvalidData(legendData)) setIsLegend_isInvalidData(true);
      if (isInvalidData(eliteData)) setIsElite_isInvalidData(true);
      if (isInvalidData(towerData)) setIsTower_isInvalidData(true);
    }
  }, [
    gmData,
    agmData,
    legendData,
    eliteData,
    towerData,
    bacoData,
    gmData?.length,
    agmData?.length,
    legendData?.length,
    eliteData?.length,
    towerData?.length,
    isAGM_isInvalidData,
    isElite_isInvalidData,
    isGM_isInvalidData,
    isLegend_isInvalidData,
    isTower_isInvalidData,
  ]);

  function onSubmit(data) {
    if (selectedElectorates.length === 0) {
      alert("Please add member at least one electorate.");
      return null; // Set error message if no options are selected
    }
    const userData = queryClient.getQueryData(["user"]);
    const action =
      actionType === "disapprove"
        ? "User disapproved a team creation request"
        : "User approved a team creation request";
    const params = {
      page: "Team Listing Request",
      action: action,
      parameters: data,
      user_id: userData.id,
    };

    //getting the list of names in the Select Dropdow Members

    const members_name_list = selectedElectorates.map((item) => {
      return {
        id:
          typeof item.value === "object" && item.value !== null
            ? item.value.id
            : item.value,
        label: item.label,
      };
    });

    if (actionType === "disapprove") {
      disapproveTeam(
        {
          editData: {
            ...data,
            added_by: userData.email,
            request_type: request_type,
            content: "Team Creation",
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
      console.log("APPROVE XXXX", JSON.stringify(teamtoEdit.members));
      approveTeam(
        {
          ...data,
          id: editId,
          // members: teamtoEdit.members,
          members: [data.electorate_id, ...teamtoEdit.members],
          baco_id: teamtoEdit.baco_id,
          members_name: members_name_list,
          added_by: userData.email,
          request_type: request_type,
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
      <div className="mb-3 text-4xl font-semibold">{action_type}</div>
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
      {!isPending_TopLeaders ? (
        <>
          {" "}
          <div className="text-m font-semibold border-solid mb-5 p-7">
            <div className="mb-10 flex justify-start text-xl">
              BRGY. {teamtoEdit.barangay}
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
                  {...register("elite_precinctno", {
                    required: "This field is required",
                  })}
                />
              </div>
            </div>
          </div>
        </>
      ) : null}

      <hr />
      <div className="grid md:grid-cols-2 gap-4">
        <div className=" p-4 border-2 border-gray-100 ">
          <div className=" mb-4">Tower</div>

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

          <FormRow label="Position" error={errors?.position?.message}>
            <StyledSelect
              disabled={isWorking}
              id="position"
              {...register("position", {
                required: "This field is required",
              })}
            >
              {leader_position.map((option, index) => (
                <option key={index} value={"Validator"}>
                  {option === "Validator" ? "TOWER" : null}
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
        {!isPending && !isPending_TopLeaders ? (
          <div className="p-4  border-2 border-gray-100">
            <div className="mb-4 flex justify-center">Team Members</div>

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
                isEditSession
                components={{ MultiValueRemove }}
                isClearable={false}
                isDisabled={true}
              />
            </FormRow>
            <div className="mt-8">
              <Listbox
                selectedElectorates={selectedElectorates}
                tower_id={teamtoEdit.electorate_id}
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
                        variation={
                          team_found && team_found.length > 0
                            ? "secondary"
                            : "primary"
                        }
                        disabled={
                          isCreating ||
                          (team_found && team_found.length > 0) ||
                          isGM_isInvalidData ||
                          isAGM_isInvalidData ||
                          isLegend_isInvalidData ||
                          isElite_isInvalidData ||
                          isTower_isInvalidData
                        }
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
                {request_status === "PENDING" &&
                  team_found &&
                  team_found.length > 0 && (
                    <div className="bg-yellow-200  text-yellow-800 p-4 rounded-md shadow-md mb-4 mx-8 mt-4">
                      <p className="text-md text-center">
                        "Info: The selected team leader already exists. The
                        request cannot be approved because duplicate records as
                        team leader are not allowed. Please disapprove this
                        request."
                      </p>
                    </div>
                  )}
                {request_status === "PENDING" &&
                  (isGM_isInvalidData ||
                    isAGM_isInvalidData ||
                    isLegend_isInvalidData ||
                    isElite_isInvalidData ||
                    isTower_isInvalidData) && (
                    <div className="bg-yellow-200 text-yellow-800 p-4 rounded-md shadow-md mb-4 mx-8 mt-4">
                      <p className="text-md text-center">
                        Warning: Some of the selected top leaders contain
                        invalid data. Please verify the names to ensure they are
                        not already listed as warriors.
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

export default CreateTeamForm;
