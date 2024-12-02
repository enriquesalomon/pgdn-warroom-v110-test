import { useForm } from "react-hook-form";
import { FaRegSave } from "react-icons/fa";
import Input from "../../../ui/Input";
import Form from "../../../ui/Form";
import Button from "../../../ui/Button";
import FormRow from "../../../ui/FormRow";
import { useEditValidationSettings } from "../hooks/useEditValidationSettings";
import { useActionPermissionContext } from "../../../context/ActionPermissionContext";
import { insertLogs } from "../../../utils/recordUserActivity";
import { useQueryClient } from "@tanstack/react-query";
import { parseAction } from "../../../utils/helpers";
import SpinnerMini from "../../../ui/SpinnerMini";
import FormRowButton from "../../../ui/FormRowButton";

function ValidationSettingsForm({ validationtoEdit = {}, onCloseModal }) {
  const queryClient = useQueryClient();
  const { actionPermission } = useActionPermissionContext();

  const isAllowedAction = parseAction(
    actionPermission,
    "update settings validation"
  );

  const { isEditing, editValidation } = useEditValidationSettings();
  const isWorking = isEditing;

  const { id: editId, ...editValues } = validationtoEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const { errors } = formState;
  function onSubmit(data) {
    const userData = queryClient.getQueryData(["user"]);

    const params = {
      page: "Settings (Validation)",
      action: `User updated the ${editValues.validation_name}`,
      parameters: data,
      user_id: userData.id,
    };

    if (isEditSession)
      editValidation(
        {
          newData: { ...data },
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
      <div className="mb-5 flex text-m font-semibold">
        EDIT VALIDATION SETTINGS
      </div>

      <FormRow label="Validation Name" error={errors?.validation_name?.message}>
        <Input
          disabled
          type="text"
          id="validation_name"
          {...register("validation_name", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="Start Date" error={errors?.start_date?.message}>
        <Input
          type="date"
          id="start_date"
          {...register("start_date", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="End Date" error={errors?.end_date?.message}>
        <Input
          type="date"
          id="end_date"
          {...register("end_date", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRowButton>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>

        {/* {isAllowedAction ? ( */}
        <Button disabled={isWorking}>
          <div className="flex justify-center items-center">
            {!isWorking ? <FaRegSave className="mr-2" /> : <SpinnerMini />}

            {isEditSession ? "Edit" : "Save"}
          </div>
        </Button>
        {/* ) : null} */}
      </FormRowButton>
    </Form>
  );
}

export default ValidationSettingsForm;
