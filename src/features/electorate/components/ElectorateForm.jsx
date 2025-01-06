import { useForm } from "react-hook-form";

import Input from "../../../ui/Input";
import Form from "../../../ui/Form";
import Button from "../../../ui/Button";
import FileInput from "../../../ui/FileInput";
import FormRow from "../../../ui/FormRow";
import { FaRegSave } from "react-icons/fa";
import { useCreateElectorate } from "../hooks/useCreateElectorate";
import { useEditElectorate } from "../hooks/useEditElectorate";
import { useActionPermissionContext } from "../../../context/ActionPermissionContext";
import { insertLogs } from "../../../utils/recordUserActivity";
import { useQueryClient } from "@tanstack/react-query";
import { parseAction } from "../../../utils/helpers";
import SpinnerMini from "../../../ui/SpinnerMini";
import styled from "styled-components";
import {
  barangayOptions,
  electorate_pcvl_remarks,
  religionOptions,
  // sectorOptions
} from "../../../utils/constants";
import { useSector } from "../hooks/useElectorates";
import { useEffect, useState } from "react";
import FormRowButton from "../../../ui/FormRowButton";
import { default as ReactSelect, components } from "react-select";
const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  width: 19.7rem;
`;
const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};
function ElectorateForm({ electorateToEdit = {}, onCloseModal, searchText }) {
  const [stateRemarks, setStateRemarks] = useState({ optionSelected: [] });
  // States for specific options
  const [isAge1830, setIsAge1830] = useState(false);
  const [isIlliterate, setIsIlliterate] = useState(false);
  const [isPwd, setIsPwd] = useState(false);
  const [isSenior, setISSenior] = useState(false);
  useEffect(() => {
    // Map database fields to electorate_pcvl_remarks options
    const initialSelected = electorate_pcvl_remarks.filter((option) => {
      if (option.value === "18-30" && electorateToEdit.remarks_18_30)
        return true;
      if (option.value === "PWD" && electorateToEdit.remarks_pwd) return true;
      if (option.value === "Illiterate" && electorateToEdit.remarks_illiterate)
        return true;
      if (
        option.value === "Senior Citizen" &&
        electorateToEdit.remarks_senior_citizen
      )
        return true;
      return false;
    });

    setStateRemarks({ optionSelected: initialSelected });
  }, []);
  const handleChange = (selected) => {
    setStateRemarks({
      optionSelected: selected,
    });
    console.log("remarks data", selected);
    // Check if specific values are present in optionSelected
    const selectedValues = selected.map((option) => option.value);

    if (selectedValues.includes("18-30")) {
      setIsAge1830(true);
    } else {
      setIsAge1830(false);
    }

    if (selectedValues.includes("Illiterate")) {
      setIsIlliterate(true);
    } else {
      setIsIlliterate(false);
    }
    if (selectedValues.includes("PWD")) {
      setIsPwd(true);
    } else {
      setIsPwd(false);
    }
    if (selectedValues.includes("Senior Citizen")) {
      setISSenior(true);
    } else {
      setISSenior(false);
    }
  };
  console.log("updated birthdate", JSON.stringify(electorateToEdit));
  const queryClient = useQueryClient();
  const { actionPermission } = useActionPermissionContext();
  const isAllowedAction = parseAction(actionPermission, "update electorate");

  const { isCreating, createElectorates } = useCreateElectorate();
  const { isEditing, editElectorate } = useEditElectorate(searchText);
  const isWorking = isCreating || isEditing;
  const { sector } = useSector();
  const { id: editId, ...editValues } = electorateToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;
  const remarks_18_30 = isAge1830 ? true : false;
  const remarks_pwd = isPwd ? true : false;
  const remarks_illiterate = isIlliterate ? true : false;
  const remarks_senior_citizen = isSenior ? true : false;
  function onSubmit(data) {
    const userData = queryClient.getQueryData(["user"]);
    const action = !isEditSession
      ? "User created a new electorate information"
      : "User updated electorate information";
    const params = {
      page: "Electorate",
      action: action,
      parameters: data,
      user_id: userData.id,
    };

    const image =
      typeof data.image === "string" ? data.image : data.image?.[0] || null;
    if (data.birthdate) {
      data.birthdate = data.birthdate.split("-").reverse().join("/");
    }

    if (isEditSession)
      editElectorate(
        {
          newElectorateData: {
            ...data,
            image,
            remarks_18_30,
            remarks_pwd,
            remarks_illiterate,
            remarks_senior_citizen,
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
    else
      createElectorates(
        { ...data, image: image, added_by: userData.id },
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
      <div className="mb-5 flex text-m font-semibold px-8">
        {isEditSession ? "EDIT ELECTORATE" : "ADD NEW ELECTORATE"}
      </div>

      <div className="grid gap-4">
        <FormRow label="Precinct No." error={errors?.precinctno?.message}>
          <Input
            type="text"
            id="precinctno"
            disabled={isWorking}
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

        <FormRow label="City" error={errors?.city?.message}>
          <Input value="PAGADIAN" type="text" id="city" disabled />
        </FormRow>

        {/* <FormRow label="Religion" error={errors?.religion?.message}>
          <Input
            type="text"
            id="religion"
            disabled={isWorking}
            {...register("religion")}
          />
        </FormRow> */}
        <FormRow label="Religion" error={errors?.religion?.message}>
          <StyledSelect
            id="religion"
            {...register("religion", { required: "This field is required" })}
          >
            {religionOptions.map((religion) => (
              <option key={religion.value} value={religion.value}>
                {religion.label}
              </option>
            ))}
          </StyledSelect>
        </FormRow>

        <FormRow label="Profession" error={errors?.profession?.message}>
          <Input
            type="text"
            id="profession"
            disabled={isWorking}
            {...register("profession")}
          />
        </FormRow>
        <FormRow label="Sector" error={errors?.sector?.message}>
          <StyledSelect
            disabled={isWorking}
            id="sector"
            {...register("sector")}
          >
            <option key="" value="">
              SELECT SECTOR
            </option>
            {sector?.map((sector) => (
              <option key={sector.name} value={sector.name}>
                {sector.name}
              </option>
            ))}
          </StyledSelect>
        </FormRow>
        <FormRow label="Remarks" error={errors?.remarks?.message}>
          <ReactSelect
            options={electorate_pcvl_remarks}
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            components={{
              Option,
            }}
            onChange={handleChange}
            value={stateRemarks.optionSelected}
            menuPlacement="top"
          />
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
