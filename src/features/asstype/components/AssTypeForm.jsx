import { useForm } from "react-hook-form";

import Input from "../../../ui/Input";
import Form from "../../../ui/Form";
import Button from "../../../ui/Button";
import FormRow from "../../../ui/FormRow";
import { FaRegSave } from "react-icons/fa";
import { useCreateAssType } from "../hooks/useCreateAssType";
import { useEditAssType } from "../hooks/useEditAssType";
import { insertLogs } from "../../../utils/recordUserActivity";
import { useQueryClient } from "@tanstack/react-query";
import SpinnerMini from "../../../ui/SpinnerMini";
import FormRowButton from "../../../ui/FormRowButton";

function AssTypeForm({ asstypeToEdit = {}, onCloseModal }) {
  const queryClient = useQueryClient();

  const { isCreating, createAssType } = useCreateAssType();
  const { isEditing, editAssType } = useEditAssType();
  const isWorking = isCreating || isEditing;

  const { id: editId, ...editValues } = asstypeToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  function onSubmit(data) {
    const userData = queryClient.getQueryData(["user"]);
    const action = !isEditSession
      ? "User created a new Assistance Type"
      : "User updated Assistance Type";
    const params = {
      page: "Settings (Assistance Type)",
      action: action,
      parameters: data,
      user_id: userData.id,
    };

    if (isEditSession)
      editAssType(
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
      createAssType(
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
    console.log(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <div className="mb-5 flex text-m font-semibold px-8">
        {isEditSession ? "EDIT ASSISTANCE TYPE" : "ADD NEW ASSISTANCE TYPE"}
      </div>

      <FormRow label="NAME" error={errors?.name?.message}>
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

              {isEditSession
                ? "Edit Assistance Type"
                : "Create new Assistance Type"}
            </div>
          </Button>
        </FormRowButton>
      </div>
    </Form>
  );
}

export default AssTypeForm;
