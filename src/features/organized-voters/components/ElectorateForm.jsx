import { useForm } from "react-hook-form";

import Input from "../../../ui/Input";
import Form from "../../../ui/Form";
import Button from "../../../ui/Button";
import FormRow from "../../../ui/FormRow";
import { FaRegSave } from "react-icons/fa";
import { useActionPermissionContext } from "../../../context/ActionPermissionContext";
import { insertLogs } from "../../../utils/recordUserActivity";
import { useQueryClient } from "@tanstack/react-query";
import { parseAction } from "../../../utils/helpers";
import SpinnerMini from "../../../ui/SpinnerMini";
import styled from "styled-components";
import { barangayOptions } from "../../../utils/constants";

import FormRowButton from "../../../ui/FormRowButton";
import { useEditElectorate } from "../hooks/useEditElectorate";
import { useInvalidateQuery } from "../hooks/useInvalidateQuery";

const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  width: 19.7rem;
`;

function ElectorateForm({
  electorateToEdit = {},
  onCloseModal,
  searchText,
  debouncedSearchTerm,
}) {
  const invalidateQueries = useInvalidateQuery(debouncedSearchTerm);
  const queryClient = useQueryClient();
  const { actionPermission } = useActionPermissionContext();
  const isAllowedAction = parseAction(actionPermission, "update electorate");

  const { isEditing, editElectorate } = useEditElectorate(searchText);
  const isWorking = isEditing;

  const { id: editId, ...editValues } = electorateToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  function onSubmit(data) {
    const userData = queryClient.getQueryData(["user"]);
    const action = !isEditSession
      ? "User updated an electorate id details"
      : "User updated an electorate id details";
    const params = {
      page: "Electorate ID",
      action: action,
      parameters: data,
      user_id: userData.id,
    };

    // const image =
    //   typeof data.image === "string" ? data.image : data.image?.[0] || null;

    if (isEditSession)
      editElectorate(
        { newElectorateData: { ...data }, id: editId },
        {
          onSuccess: (data) => {
            invalidateQueries();
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

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
      style={{ width: "100%" }}
    >
      <div className="mb-5 flex text-m font-semibold px-8">
        {isEditSession ? "EDIT ELECTORATE ID DETAILS" : "ADD NEW ELECTORATE"}
      </div>

      <div className="grid gap-4">
        <FormRow label="Precinct No." error={errors?.precinctno?.message}>
          <Input
            type="text"
            id="precinctno"
            disabled
            {...register("precinctno", {
              required: "This field is required",
            })}
          />
        </FormRow>
        <FormRow label="Lastname" error={errors?.lastname?.message}>
          <Input
            type="text"
            id="lastname"
            disabled={isWorking}
            {...register("lastname", {
              required: "This field is required",
            })}
          />
        </FormRow>

        <FormRow label="Firstname" error={errors?.firstname?.message}>
          <Input
            type="text"
            id="firstname"
            disabled={isWorking}
            {...register("firstname", {
              required: "This field is required",
            })}
          />
        </FormRow>
        <FormRow label="Middlename" error={errors?.middlename?.message}>
          <Input
            type="text"
            id="middlename"
            disabled={isWorking}
            {...register("middlename", {
              required: "This field is required",
            })}
          />
        </FormRow>
        <FormRow label="Purok" error={errors?.purok?.message}>
          <Input
            type="text"
            id="purok"
            disabled={isWorking}
            {...register("purok", {
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

        <FormRow label="Birthdate" error={errors?.birthdate?.message}>
          <Input
            type="date"
            id="birthdate"
            disabled={isWorking}
            {...register("birthdate")}
          />
        </FormRow>

        {/* <FormRow label="Electorate photo">
          <FileInput
            id="image"
            accept="image/*"
            {...register("image", {
              required: isEditSession ? false : "This field is required",
            })}
          />
        </FormRow> */}
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
              {!isWorking ? <FaRegSave className="mr-2" /> : <SpinnerMini />}

              {isEditSession ? "Edit electorate" : "Create new electorate"}
            </div>
          </Button>
        ) : null}
      </FormRowButton>
    </Form>
  );
}

export default ElectorateForm;
