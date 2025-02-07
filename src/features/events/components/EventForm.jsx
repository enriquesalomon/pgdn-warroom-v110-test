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
import { useEditEvent } from "../hooks/useEditEvent";
import { useCreateEvent } from "../hooks/useCreateEvent";
import Select, { components } from "react-select";
import { useEffect, useState } from "react";
import { useSecondSelectData } from "../hooks/useData";

const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  width: 19.7rem;
`;
const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "green" : "white", // Background color of each option
    color: state.isDisabled ? "green" : "black",
    width: "100%", // Width of each option
    "&:hover": {
      backgroundColor: "green", // Background color when hovering
      color: "white", // Text color when hovering
    },
  }),
};
function EventForm({ userToEdit = {}, eventtype, onCloseModal }) {
  const [selectedFirst, setSelectedFirst] = useState(null);
  const queryClient = useQueryClient();

  const { isCreating, createEvent } = useCreateEvent();
  const { isEditing, editEvent } = useEditEvent();
  const isWorking = isCreating || isEditing;

  const { id: editId, ...editValues } = userToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  const [selectedSecond, setSelectedSecond] = useState(null);
  const { data: secondData, isLoading: secondLoading } = useSecondSelectData();
  const [selectedLeader, setSelectedLeader] = useState(null);
  // useEffect(() => {
  //   setSelectedLeader(selectedSecond);
  //   if (isEditSession && eventtype && Array.isArray(eventtype.data)) {
  //     // Check if teams.data is an array
  //     let filteredEventType = eventtype.data.filter(
  //       (item) => item.id === userToEdit.event_type_id
  //     );
  //     filteredEventType = filteredEventType.map((eventTYpe) => ({
  //       value: eventTYpe,
  //       label: `${eventTYpe.type_name} ${eventTYpe.description}`,
  //       isFixed: eventTYpe.id !== userToEdit.event_type_id ? false : true,
  //     }));

  //     setSelectedSecond(filteredEventType);
  //   }
  // }, [isEditSession, eventtype, userToEdit, selectedSecond, selectedLeader]);
  useEffect(() => {
    // Avoid redundant updates
    if (!isEditSession || !eventtype || !Array.isArray(eventtype.data)) return;

    let filteredEventType = eventtype.data.filter(
      (item) => item.id === userToEdit.event_type_id
    );

    const mappedEventType = filteredEventType.map((eventTYpe) => ({
      value: eventTYpe,
      label: `${eventTYpe.type_name} ${eventTYpe.description}`,
      isFixed: eventTYpe.id === userToEdit.event_type_id,
    }));

    // Avoid unnecessary state updates by comparing current and new values
    if (JSON.stringify(mappedEventType) !== JSON.stringify(selectedSecond)) {
      setSelectedSecond(mappedEventType);
    }

    // Ensure `selectedLeader` is set only once or when necessary
    if (selectedLeader !== selectedSecond) {
      setSelectedLeader(selectedSecond);
    }
  }, [isEditSession, eventtype, userToEdit, selectedSecond, selectedLeader]); // Remove `selectedSecond` and `selectedLeader` from dependencies

  const handleFirstChange = (selectedOption) => {
    setSelectedFirst(selectedOption);
    setSelectedSecond(null); // Reset second select when first select changes
  };

  function onSubmit(data) {
    if (!isEditSession) {
      data.event_type = selectedFirst.value;
    }
    if (isEditSession)
      editEvent(
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
      createEvent(
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
        {isEditSession ? "EDIT EVENT" : "ADD EVENT"}
      </div>

      {!isEditSession && (
        <FormRow label="EVENT TYPE" error={errors?.event_type?.message}>
          <Select
            id="event_type_id"
            isLoading={secondLoading}
            options={secondData?.map((item) => ({
              value: item.type_name,
              label: item.type_name,
            }))}
            onChange={handleFirstChange}
            value={selectedFirst}
            isDisabled={isEditSession || isWorking}
            styles={customStyles}
          />
        </FormRow>
      )}
      {isEditSession && (
        <FormRow label="EVENT TYPE">
          <Input
            type="text"
            id="event_type"
            disabled={true}
            {...register("event_type", {
              required: "This field is required",
            })}
          />
        </FormRow>
      )}

      <FormRow label="EVENT TITLE" error={errors?.title?.message}>
        <Input
          type="text"
          id="title"
          disabled={isWorking}
          {...register("title", {
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
      <FormRow label="QR USE" error={errors?.qr_use?.message}>
        <StyledSelect
          disabled={isWorking}
          id="qr_use"
          {...register("qr_use", {
            required: "This field is required",
          })}
        >
          <option>Select</option>
          <option value="ATTENDANCE">ATTENDANCE</option>
          <option value="RELEASING">RELEASING</option>
        </StyledSelect>
      </FormRow>
      <FormRow label="VENUE/LOCATION" error={errors?.location?.message}>
        <Input
          type="text"
          id="location"
          disabled={isWorking}
          {...register("location", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="DATE" error={errors?.event_date?.message}>
        <Input
          type="date"
          id="event_date"
          disabled={isWorking}
          {...register("event_date")}
        />
      </FormRow>
      <FormRow label="START TIME" error={errors?.start_time?.message}>
        <Input
          type="time"
          id="start_time"
          disabled={isWorking}
          {...register("start_time")}
        />
      </FormRow>
      <FormRow label="END TIME" error={errors?.end_time?.message}>
        <Input
          type="time"
          id="end_time"
          disabled={isWorking}
          {...register("end_time")}
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

              {isEditSession ? "Edit Event" : "Create new Event"}
            </div>
          </Button>
        </FormRowButton>
      </div>
    </Form>
  );
}

export default EventForm;
