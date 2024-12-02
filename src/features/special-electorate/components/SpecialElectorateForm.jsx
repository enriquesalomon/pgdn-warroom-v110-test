import { useForm } from "react-hook-form";
import Input from "../../../ui/Input";
import Form from "../../../ui/Form";
import Button from "../../../ui/Button";
import FormRow from "../../../ui/FormRow";
import { useEditSpecialElectorate } from "../hooks/useEditSpecialElectorate";
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
const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  width: 19.7rem;
`;

function SpecialElectorateForm({ electorateToEdit = {}, onCloseModal }) {
  const queryClient = useQueryClient();
  const { actionPermission } = useActionPermissionContext();
  const isAllowedAction = parseAction(
    actionPermission,
    "tag special electorate"
  );
  const { isEditing, editSpecialElectorate } = useEditSpecialElectorate();
  const [searchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { electorates } = useElectoratesPer_Brgy2(debouncedSearchTerm);
  const isWorking = isEditing;
  const [val_id, setVal_id] = useState();
  const { id, ...editValues } = electorateToEdit;

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
          val_id: val_id,
          confirmed_by: userData.email,
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
    const { id, firstname, middlename, lastname, brgy, purok } = electorate;
    setValue("firstname", firstname);
    setValue("middlename", middlename);
    setValue("lastname", lastname);
    setValue("brgy", brgy);
    setValue("id", id);
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
      style={{ width: "100%" }}
    >
      <div className="mb-5 flex text-m font-semibold px-8">
        {isEditSession
          ? "TAG A NEW SPECIAL ELECTORATE"
          : "TAG A NEW SPECIAL ELECTORATE"}
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

        <FormRow label="Tag" error={errors?.voters_type?.message}>
          <StyledSelect
            disabled={isWorking}
            id="voters_type"
            {...register("voters_type", { required: "This field is required" })}
          >
            <option value="INC">INC</option>
            <option value="JEHOVAH">JEHOVAH</option>
            <option value="OT">OUT OF TOWN</option>
          </StyledSelect>
        </FormRow>
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

              {isEditSession ? "Tag" : "Tag"}
            </div>
          </Button>
        ) : null}
      </FormRowButton>
    </Form>
  );
}

export default SpecialElectorateForm;
