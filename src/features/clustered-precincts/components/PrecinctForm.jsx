import { useForm } from "react-hook-form";

import Input from "../../../ui/Input";
import Form from "../../../ui/Form";
import Button from "../../../ui/Button";
import FormRow from "../../../ui/FormRow";
import { FaRegSave } from "react-icons/fa";
import { useCreatePrecinct } from "../hooks/useCreatePrecinct";
import { useEditPrecinct } from "../hooks/useEditPrecinct";
import { insertLogs } from "../../../utils/recordUserActivity";
import { useQueryClient } from "@tanstack/react-query";
import SpinnerMini from "../../../ui/SpinnerMini";
import styled from "styled-components";
import FormRowButton from "../../../ui/FormRowButton";
const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  width: 19.7rem;
`;

function PrecinctForm({ sectorToEdit = {}, onCloseModal }) {
  const queryClient = useQueryClient();

  const { isCreating, createSector } = useCreatePrecinct();
  const { isEditing, editSector } = useEditPrecinct();
  const isWorking = isCreating || isEditing;

  const { id: editId, ...editValues } = sectorToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  function onSubmit(data) {
    const userData = queryClient.getQueryData(["user"]);
    const action = !isEditSession
      ? "User created a new sector"
      : "User updated sector";
    const params = {
      page: "Settings (Sector)",
      action: action,
      parameters: data,
      user_id: userData.id,
    };

    if (isEditSession)
      editSector(
        { newElectorateData: { ...data }, id: editId },
        {
          onSuccess: (data) => {
            insertLogs(params);
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      createSector(
        { ...data },
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

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <div className="mb-5 flex text-m font-semibold ">
        {isEditSession ? "EDIT SECTOR" : "ADD NEW SECTOR"}
      </div>

      <FormRow label="SECTOR NAME" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "This field is required",
          })}
        />
      </FormRow>
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

              {isEditSession ? "Edit Sector" : "Create new Sector"}
            </div>
          </Button>
        </FormRowButton>
      </div>
    </Form>
  );
}

export default PrecinctForm;
