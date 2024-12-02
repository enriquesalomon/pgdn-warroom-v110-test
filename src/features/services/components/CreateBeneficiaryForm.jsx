import { useForm } from "react-hook-form";
import { FaRegSave } from "react-icons/fa";
import Input from "../../../ui/Input";
import Form from "../../../ui/Form";
import Button from "../../../ui/Button";
import Textarea from "../../../ui/Textarea";
import FormRow from "../../../ui/FormRow";
import FormRowVertical from "../../../ui/FormRowVertical";
import styled from "styled-components";
import { useCreateService } from "../hooks/useCreateService";
import { useEditService } from "../hooks/useEditService";
import { useActionPermissionContext } from "../../../context/ActionPermissionContext";
import { useState } from "react";
import { useElectoratesPer_Brgy2 } from "../../electorate/hooks/useElectorates";
import { HiXMark, HiArrowDown, HiMagnifyingGlass } from "react-icons/hi2";
import ButtonIcon from "../../../ui/ButtonIcon";
import { insertLogs } from "../../../utils/recordUserActivity";
import { useQueryClient } from "@tanstack/react-query";
import { parseAction } from "../../../utils/helpers";
import SpinnerMini from "../../../ui/SpinnerMini";
import Modal from "../../../ui/Modal";
import ElectoratesTable from "./ElectoratesTable";

import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { useAssistance_type } from "../hooks/useServices";
import FormRowButton from "../../../ui/FormRowButton";

const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  width: 19.7rem;
`;

function CreateBeneficiaryForm({ servicetoEdit = {}, onCloseModal }) {
  const [searchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { electorates } = useElectoratesPer_Brgy2(debouncedSearchTerm);
  const [searchParams, setSearchParams] = useSearchParams();
  const { assistance } = useAssistance_type();
  const queryClient = useQueryClient();
  // const { electorates } = useElectorates();
  const { actionPermission } = useActionPermissionContext();
  const isAllowedAction = parseAction(actionPermission, "update services");
  const { isCreating, createService } = useCreateService();
  const { isEditing, editService } = useEditService();
  const isWorking = isCreating || isEditing;

  const { id: editId, ...editValues } = servicetoEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState, setValue } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const { errors } = formState;

  const handleElectorateSelect = (electorate) => {
    const { id, firstname, middlename, lastname, brgy, purok } = electorate;
    setValue("fullname", firstname + " " + middlename + " " + lastname);
    setValue("barangay", brgy);
    setValue("electorate_id", id);
    setValue("purok", purok);
  };

  function onSubmit(data) {
    const userData = queryClient.getQueryData(["user"]);
    const action = !isEditSession
      ? "User created a new services information"
      : "User updated services information";
    const params = {
      page: "Services",
      action: action,
      parameters: data,
      user_id: userData.id,
    };

    if (isEditSession)
      editService(
        {
          newServicesData: { ...data },
          id: editId,
        },

        {
          onSuccess: (data) => {
            searchParams.delete("page");
            setSearchParams(searchParams);
            insertLogs(params);
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      createService(
        { ...data, user_id: userData.id },
        {
          onSuccess: (data) => {
            searchParams.delete("page");
            setSearchParams(searchParams);
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
      {/* <div className="bg-red-800 px-4 sm:px-12"> */}
      <div className="mb-12 flex text-m font-semibold px-16">
        {isEditSession ? "EDIT AVAILMENT RECORD" : "ADD NEW AVAILMENT RECORD"}
      </div>
      <div className="grid gap-4">
        {!isEditSession && (
          <FormRow
            label="Search Beneficiary"
            error={errors?.electorate?.message}
          >
            <Modal>
              <Modal.Open opens="service-form">
                <Button
                  // disabled={isEditSession}
                  type="button"
                >
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
        <FormRow label="Full Name" error={errors?.fullname?.message}>
          <Input
            disabled
            type="text"
            id="fullname"
            {...register("fullname", {
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
        <FormRow label="Purok" error={errors?.purok?.message}>
          <Input type="text" {...register("purok")} disabled />
        </FormRow>

        {/* <div className="border border-gray-100 rounded-md p-12"> */}
        <FormRow
          label="Assistance Type"
          error={errors?.assistance_type?.message}
        >
          <StyledSelect
            disabled={isWorking}
            className="hover:cursor-pointer"
            id="assistance_type"
            {...register("assistance_type", {
              required: "This field is required",
            })}
          >
            <option key="" value="">
              SELECT
            </option>
            {assistance?.map((ass) => (
              <option key={ass.name} value={ass.name}>
                {ass.name}
              </option>
            ))}
          </StyledSelect>
        </FormRow>

        <FormRow
          label="Date of Availment"
          error={errors?.date_availed?.message}
        >
          <Input
            disabled={isWorking}
            type="date"
            id="date_availed"
            {...register("date_availed", {
              required: "This field is required",
            })}
          />
        </FormRow>

        <div className="px-16">
          <FormRowVertical
            label="Description"
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
      </div>
      {/* </div> */}
      {/* </div> */}
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

              {isEditSession ? "Edit" : "Save"}
            </div>
          </Button>
        ) : null}
      </FormRowButton>
    </Form>
  );
}

export default CreateBeneficiaryForm;
