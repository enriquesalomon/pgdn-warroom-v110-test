import { useForm } from "react-hook-form";

import Input from "../../../ui/Input";
import Form from "../../../ui/Form";
import Button from "../../../ui/Button";
import FormRow from "../../../ui/FormRow";
import { FaRegSave } from "react-icons/fa";

import { insertLogs } from "../../../utils/recordUserActivity";
import { useQueryClient } from "@tanstack/react-query";
import SpinnerMini from "../../../ui/SpinnerMini";
import styled from "styled-components";
import FormRowButton from "../../../ui/FormRowButton";
import FormRowVertical from "../../../ui/FormRowVertical";
import Textarea from "../../../ui/Textarea";
import { useEditEventType } from "../hooks/useEditEventType";
import { useCreateEventType } from "../hooks/useCreateEventType";
const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  width: 19.7rem;
`;

function EvenTypeForm({ sectorToEdit = {}, onCloseModal }) {
  const queryClient = useQueryClient();

  const { isCreating, createEventType } = useCreateEventType();
  const { isEditing, editSector } = useEditEventType();
  const isWorking = isCreating || isEditing;

  const { id: editId, ...editValues } = sectorToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  function onSubmit(data) {
    // const userData = queryClient.getQueryData(["user"]);
    // const action = !isEditSession
    //   ? "User created a new event type"
    //   : "User updated sector";
    // const params = {
    //   page: "Settings (Sector)",
    //   action: action,
    //   parameters: data,
    //   user_id: userData.id,
    // };

    if (isEditSession)
      editSector(
        { newElectorateData: { ...data }, id: editId },
        {
          onSuccess: (data) => {
            // insertLogs(params);
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      createEventType(
        { ...data },
        {
          onSuccess: (data) => {
            // insertLogs(params);
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
      <div className="mb-5 flex text-m font-semibold ">
        {isEditSession ? "EDIT EVENT TYPE" : "ADD EVENT TYPE"}
      </div>

      <FormRow label="EVENT TYPE NAME" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("type_name", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <div className="px-16">
        <FormRowVertical
          label="DESCRIPTION"
          error={errors?.description?.message}
        >
          <Textarea
            disabled={isWorking}
            type="text"
            id="description"
            defaultValue=""
            {...register("description", {
              required: "This field is required",
            })}
          />
        </FormRowVertical>
      </div>
      <div className="mt-12">
        <FormRowButton>
          <Button
            disabled={isWorking}
            variation="secondary"
            type="reset"
            onClick={() => onCloseModal?.()}
          >
            Cancel
          </Button>
          <Button disabled={isWorking}>
            <div className="flex justify-center items-center">
              {!isWorking ? <FaRegSave className="mr-2" /> : <SpinnerMini />}

              {isEditSession ? "Edit Event Type" : "Create new Event Type"}
            </div>
          </Button>
        </FormRowButton>
      </div>
    </Form>
  );
}

export default EvenTypeForm;
