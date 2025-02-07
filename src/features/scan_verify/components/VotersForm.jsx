import { useForm } from "react-hook-form";
import Input from "../../../ui/Input";
import Form from "../../../ui/Form";
import Button from "../../../ui/Button";
import FormRow from "../../../ui/FormRow";
import { useActionPermissionContext } from "../../../context/ActionPermissionContext";
import { insertLogs } from "../../../utils/recordUserActivity";
import { useQueryClient } from "@tanstack/react-query";
import { parseAction } from "../../../utils/helpers";
import SpinnerMini from "../../../ui/SpinnerMini";
import styled from "styled-components";
import { barangayOptions } from "../../../utils/constants";
import Modal from "../../../ui/Modal";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useElectoratesPer_Brgy2 } from "../../electorate/hooks/useElectorates";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import ElectoratesTable from "./ElectoratesTable";
import { useFetchSettings } from "../../request/hooks/useRequest";
import { LiaUserTagSolid } from "react-icons/lia";
import FormRowButton from "../../../ui/FormRowButton";
import { useEditVoters } from "../hooks/useEditVoters";
import FormRowVertical from "../../../ui/FormRowVertical";
import Textarea from "../../../ui/Textarea";
const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  width: 19.7rem;
`;

function VotersForm({ electorateToEdit = {}, onCloseModal }) {
  const queryClient = useQueryClient();
  const { actionPermission } = useActionPermissionContext();
  const isAllowedAction = parseAction(
    actionPermission,
    "tag special electorate"
  );
  const { isEditing, editSpecialElectorate } = useEditVoters();
  const [searchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { electorates } = useElectoratesPer_Brgy2(debouncedSearchTerm);
  const isWorking = isEditing;
  const [val_id, setVal_id] = useState();
  const { id, ...editValues } = electorateToEdit;
  const [voter_remarks, setVoter_remarks] = useState([]);
  const [voter_teamID, setVoter_teamID] = useState([]);
  const isEditSession = Boolean(id);

  const { register, handleSubmit, reset, formState, setValue } = useForm({
    defaultValues: isEditSession ? electorateToEdit : {},
  });
  const { errors } = formState;
  const { data: ValidationSettings } = useFetchSettings();
  useEffect(() => {
    if (ValidationSettings?.length > 0) setVal_id(ValidationSettings[0].id);
  }, [ValidationSettings]);

  function onSubmit(data) {
    const userData = queryClient.getQueryData(["user"]);
    const action = !isEditSession
      ? "User tag a new special electorates"
      : "User tag a new special electorates";
    const params = {
      page: "Special Electorate",
      action: action,
      parameters: data,
      user_id: userData.id,
    };

    editSpecialElectorate(
      {
        newElectorateData: {
          ...data,
          team_id: voter_teamID,
          user_id: userData.id,
        },
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

  function onError(errors) {
    // console.log(errors);
  }
  const handleElectorateSelect = (electorate) => {
    const {
      id,
      firstname,
      middlename,
      lastname,
      brgy,
      purok,
      precinctLeader,
      isbaco,
      is_gm,
      is_agm,
      is_legend,
      is_elite,
      isleader,
      precinctleader,
      voters_type,
    } = electorate;
    console.log("dirir", JSON.stringify(electorate));
    setValue("firstname", firstname);
    setValue("middlename", middlename);
    setValue("lastname", lastname);
    setValue("brgy", brgy);
    setValue("id", id);
    setVoter_teamID(precinctleader);

    if (
      isleader === true ||
      isbaco === true ||
      is_gm === true ||
      is_agm === true ||
      is_legend === true ||
      is_elite ||
      precinctleader !== null
    ) {
      setVoter_remarks("ALLIED VOTER");
      setValue("scanned_remarks", "ALLIED VOTER");
    } else {
      setVoter_remarks("SWING VOTER");
      setValue("scanned_remarks", "SWING VOTER");
    }
    //add condition if not meet all then set to swing voters
    if (voters_type !== null) {
      setVoter_remarks("SWING VOTER");
      setValue("scanned_remarks", "SWING VOTER");
    }
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
      style={{ width: "100%" }}
    >
      <div className="mb-5 flex text-m font-semibold px-8">
        {isEditSession ? "NEW" : "NEW"}
      </div>

      <div className="grid gap-4">
        {!isEditSession && (
          <FormRow label="Search Name" error={errors?.electorate?.message}>
            <Modal>
              <Modal.Open opens="service-form">
                <Button disabled={isEditSession} type="button">
                  <div className="flex justify-center items-center">
                    <HiMagnifyingGlass className="mr-2" />
                  </div>
                </Button>
              </Modal.Open>
              <Modal.Window backdrop={true} name="service-form" heightvar="85%">
                <ElectoratesTable
                  electorates={electorates}
                  onSelectElectorate={handleElectorateSelect}
                  onCloseModal={onCloseModal}
                />
              </Modal.Window>
            </Modal>
          </FormRow>
        )}

        <FormRow label="Electorate ID" error={errors?.id?.message}>
          <Input
            disabled
            type="text"
            id="id"
            {...register("id", {
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
        <FormRow label="Middlename" error={errors?.middlename?.message}>
          <Input
            type="text"
            id="middlename"
            disabled
            {...register("middlename", {
              required: "This field is required",
            })}
          />
        </FormRow>
        <FormRow label="Brgy" error={errors?.brgy?.message}>
          <StyledSelect
            disabled
            id="brgy"
            {...register("brgy", { required: "This field is required" })}
          >
            {barangayOptions.map((barangay) => (
              <option key={barangay.value} value={barangay.value}>
                {barangay.label}
              </option>
            ))}
          </StyledSelect>
        </FormRow>

        <FormRow label="Voter Type" error={errors?.scanned_remarks?.message}>
          <StyledSelect
            disabled={isWorking}
            id="scanned_remarks"
            {...register("scanned_remarks", {
              required: "This field is required",
            })}
          >
            <option value="">...</option>
            <option value="ALLIED VOTER">ALLIED VOTER</option>
            <option value="SWING VOTER">SWING VOTER</option>
          </StyledSelect>
        </FormRow>

        <FormRowVertical label="Notes" error={errors?.notes?.message}>
          <Textarea
            disabled={isWorking}
            type="text"
            id="notes"
            defaultValue=""
            {...register("notes", {
              required: "This field is required",
            })}
          />
        </FormRowVertical>
      </div>
      <FormRowButton>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        {isAllowedAction ? (
          <Button disabled={isWorking}>
            <div className="flex justify-center items-center">
              {!isWorking ? (
                <LiaUserTagSolid className="mr-2" />
              ) : (
                <SpinnerMini />
              )}

              {isEditSession ? "Save" : " Save"}
            </div>
          </Button>
        ) : null}
      </FormRowButton>
    </Form>
  );
}

export default VotersForm;
