import { useForm } from "react-hook-form";

import Input from "../../../ui/Input";
import Form from "../../../ui/Form";
import Button from "../../../ui/Button";
import FormRow from "../../../ui/FormRow";
import { FaRegSave } from "react-icons/fa";
import { useCreateBaco } from "../hooks/useCreateBaco";
import { useEditBaco } from "../hooks/useEditBaco";
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
import { useState } from "react";
import { useDebounce } from "use-debounce";
import ElectoratesTable from "./ElectoratesTable";
import FormRowButton from "../../../ui/FormRowButton";
const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  width: 19.7rem;
`;

function BacoForm({ electorateToEdit = {}, onCloseModal, searchText }) {
  const queryClient = useQueryClient();
  const { actionPermission } = useActionPermissionContext();
  const isAllowedAction = parseAction(actionPermission, "update baco");

  const { isCreating, createBaco } = useCreateBaco();
  const { isEditing, editBaco } = useEditBaco(searchText);
  const [searchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { electorates } = useElectoratesPer_Brgy2(debouncedSearchTerm);
  const isWorking = isCreating || isEditing;

  const { id: editId, ...editValues } = electorateToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState, setValue } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  function onSubmit(data) {
    const userData = queryClient.getQueryData(["user"]);
    const action = !isEditSession
      ? "User created a new baco information"
      : "User updated baco information";
    const params = {
      page: "Baco",
      action: action,
      parameters: data,
      user_id: userData.id,
    };

    if (isEditSession)
      editBaco(
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
      createBaco(
        { ...data, added_by: userData.email },
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
  const handleElectorateSelect = (electorate) => {
    const { id, firstname, middlename, lastname, brgy, purok } = electorate;
    setValue("firstname", firstname);
    setValue("middlename", middlename);
    setValue("lastname", lastname);
    setValue("brgy", brgy);
    setValue("electorate_id", id);
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
      style={{ width: "100%" }}
    >
      <div className="mb-5 flex text-m font-semibold px-8">
        {isEditSession ? "EDIT BACO" : "ADD NEW BACO"}
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

        <FormRow label="Electorate ID" error={errors?.electorate_id?.message}>
          <Input
            disabled
            type="text"
            id="electorate_id"
            {...register("electorate_id", {
              required: "This field is required",
            })}
          />
        </FormRow>

        <FormRow label="Lastname" error={errors?.lastname?.message}>
          <Input
            type="text"
            id="lastname"
            disabled={isWorking || isEditSession}
            {...register("lastname", {
              required: "This field is required",
            })}
          />
        </FormRow>
        <FormRow label="Firstname" error={errors?.firstname?.message}>
          <Input
            type="text"
            id="firstname"
            disabled={isWorking || isEditSession}
            {...register("firstname", {
              required: "This field is required",
            })}
          />
        </FormRow>
        <FormRow label="Middlename" error={errors?.middlename?.message}>
          <Input
            type="text"
            id="middlename"
            disabled={isWorking || isEditSession}
            {...register("middlename", {
              required: "This field is required",
            })}
          />
        </FormRow>
        <FormRow label="Brgy" error={errors?.brgy?.message}>
          <StyledSelect
            disabled={isWorking}
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
        <FormRow label="Contact No" error={errors?.contactno?.message}>
          <Input
            type="text"
            id="contactno"
            disabled={isWorking}
            {...register("contactno")}
          />
        </FormRow>
        <FormRow label="Gender" error={errors?.gender?.message}>
          <StyledSelect
            disabled={isWorking}
            id="gender"
            {...register("gender", { required: "This field is required" })}
          >
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
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

              {isEditSession ? "Edit baco" : "Create new baco"}
            </div>
          </Button>
        ) : null}
      </FormRowButton>
    </Form>
  );
}

export default BacoForm;
