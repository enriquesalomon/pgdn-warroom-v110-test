import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSignup } from "../hooks/useSignup";
import { useQueryClient } from "@tanstack/react-query";
import { useActionPermissionContext } from "../../../../context/ActionPermissionContext";
import Button from "../../../../ui/Button";
import Form from "../../../../ui/Form";
import FormRow from "../../../../ui/FormRow";
import Input from "../../../../ui/Input";
import styled from "styled-components";
import { useEditUser } from "../hooks/useEditUser";
import { encryptPassword } from "../../../../utils/cryptoUtils";
import { FaRegSave } from "react-icons/fa";
import Select from "react-select";
import { insertLogs } from "../../../../utils/recordUserActivity";
import { parseAction } from "../../../../utils/helpers";
import SpinnerMini from "../../../../ui/SpinnerMini";
import { useSecondSelectData } from "../hooks/useData";
import { barangayOptions } from "../../../../utils/constants";
import FormRowButton from "../../../../ui/FormRowButton";
const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "orange" : "white", // Background color of each option
    color: state.isDisabled ? "orange" : "black",
    width: "100%", // Width of each option
    "&:hover": {
      backgroundColor: "orange", // Background color when hovering
      color: "white", // Text color when hovering
    },
  }),
};

const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  width: 19.7rem;
  @media (max-width: 768px) {
    min-width: 500px;
  }
`;

function SignupFormStaff({
  userToEdit = {},
  onCloseModal,
  onChangeAccessType,
  baco,
}) {
  // const [selectedFirst, setSelectedFirst] = useState(null);
  const [selectedSecond, setSelectedSecond] = useState(null);
  // const { data: firstData, isLoading: firstLoading } = useFirstSelectData();
  const { data: secondData, isLoading: secondLoading } = useSecondSelectData();

  const queryClient = useQueryClient();
  const { signup, isPending } = useSignup();
  const { isEditing, editUser } = useEditUser();
  const isWorking = isPending || isEditing;

  const { actionPermission } = useActionPermissionContext();

  const {
    id: editId,
    email,
    page_permission,
    action_permission,
    team_id,
    ...editValues
  } = userToEdit;

  const isEditSession = Boolean(editId);
  const hasemail = email;
  const {
    register,
    formState,
    getValues,
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedActions, setSelectedActions] = useState([]);

  useEffect(() => {
    const initialSelectedOptions = JSON.parse(page_permission || "[]");
    setSelectedOptions(initialSelectedOptions);
  }, [page_permission]);
  useEffect(() => {
    const initialSelectedActions = JSON.parse(action_permission || "[]");
    setSelectedActions(initialSelectedActions);
  }, [action_permission]);
  useEffect(() => {
    // Send the accesstype value to the parent component
    onChangeAccessType && onChangeAccessType(watch("account_role"));
  }, [onChangeAccessType, watch]);

  const [selectedLeader, setSelectedLeader] = useState(null);

  useEffect(() => {
    setSelectedLeader(selectedSecond);
    if (isEditSession) {
    } else {
      const label_brgy = selectedSecond?.label || "";
      const brgy_only = label_brgy.split(" - ")[1];
      setValue("brgy", brgy_only);

      const label_fullname = selectedSecond?.label || "";
      const cleanedLabel_fullname = label_fullname.split(" - ")[0];
      setValue("fullname", cleanedLabel_fullname);
    }
  }, [selectedSecond, setValue, selectedLeader, isEditSession, secondData]);

  useEffect(() => {
    if (isEditSession && baco && Array.isArray(baco.data)) {
      // Check if teams.data is an array
      let filteredLeader = baco.data.filter(
        (item) => item.id === userToEdit.baco_id
      );
      filteredLeader = filteredLeader.map((leader) => ({
        value: leader,
        label: `${leader.firstname} ${leader.lastname}`,
        isFixed: leader.id !== userToEdit.baco_id ? false : true,
      }));

      setSelectedSecond(filteredLeader);
      // let filteredPrecinct = baco.data.filter(
      //   (item) => item.id === userToEdit.baco_id
      // );
      // filteredPrecinct = filteredPrecinct.map((leader) => ({
      //   value: leader,
      //   label: `${leader.precinctno}`,
      //   // isFixed: leader.id !== userToEdit.leader_id ? false : true,
      // }));

      // setSelectedFirst(filteredPrecinct);
    }
  }, [isEditSession, baco, userToEdit]);
  const onSubmit = (data) => {
    const userData = queryClient.getQueryData(["user"]);
    const action = !isEditSession
      ? "User created a new ID Staff users account"
      : "User updated ID Staff users account";
    const params = {
      page: "Users",
      action: action,
      parameters: data,
      user_id: userData.id,
    };

    data.action_permission = selectedActions;
    data.page_permission = selectedOptions;
    const encryptedPassword = encryptPassword(data.password);
    if (isEditSession)
      editUser(
        { newUserData: { ...data }, id: editId },
        {
          onSuccess: (data) => {
            insertLogs(params);
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      signup(
        {
          ...data,
          createdby_id: userData.id,
          createdby: userData?.email,
          encryptedPassword: encryptedPassword,
        },
        {
          onSuccess: (data) => {
            insertLogs(params);
            reset();
            onCloseModal?.();
          },
        }
      );
  };

  function onError(errors) {
    // console.log(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
      style={{ width: "100%" }}
    >
      <div className="mb-12 flex text-m font-semibold px-16">
        {isEditSession ? "EDIT STAFF - APP USER" : "ADD NEW STAFF - APP USER"}
      </div>
      <div className="grid gap-4">
        <div className="font-medium mt-5 flex justify-center">Profile Info</div>
        {/* {watch("account_role") === "Baco" && (
          <FormRow label="BACO" error={errors?.leaders?.message}>
            <Select
              isDisabled={isEditSession}
              isLoading={secondLoading}
              value={selectedSecond}
              onChange={setSelectedSecond}
              options={leader_list}
              isEditSession
              menuPlacement={isEditSession ? "top" : "bottom"}
              styles={customStyles}
            />
          </FormRow>
        )} */}

        {/* {watch("account_role") === "Validator" && (
          <FormRow label="BACO" error={errors?.leaders?.message}>
            <Select
              isLoading={secondLoading}
              value={selectedSecond}
              onChange={setSelectedSecond}
              options={leader_list}
              isEditSession
              menuPlacement={isEditSession ? "top" : "bottom"}
              styles={customStyles}
            />
          </FormRow>
        )} */}

        <FormRow label="Name" error={errors?.fullname?.message}>
          <Input
            disabled={isWorking}
            type="text"
            id="fullname"
            {...register("fullname", { required: "This field is required" })}
          />
        </FormRow>
        {/* <FormRow label="Barangay" error={errors?.brgy?.message}>
          <StyledSelect
            type="text"
            id="brgy"
            disabled={isWorking}
            {...register("brgy", { required: "This field is required" })}
          />
          {barangayOptions.map((barangay) => (
            <option key={barangay.value} value={barangay.value}>
              {barangay.label}
            </option>
          ))}
        </FormRow> */}
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
        <FormRow label="Access type" error={errors?.accesstype?.message}>
          <StyledSelect
            className="hover:cursor-pointer"
            disabled={isEditSession}
            id="accesstype"
            {...register("accesstype", { required: "This field is required" })}
          >
            <option value="App User">App User</option>
          </StyledSelect>
        </FormRow>
        <FormRow label="Account role" error={errors?.account_role?.message}>
          <StyledSelect
            className="hover:cursor-pointer"
            id="account_role"
            {...register("account_role", {
              required: "This field is required",
            })}
          >
            <option value="">Select</option>
            <option value="ID Data Collector">ID Data Collector</option>
            <option value="QR Scanner Operator">QR Scanner Operator</option>
          </StyledSelect>
        </FormRow>

        {!hasemail && (
          <>
            <div className="font-medium mt-12 flex justify-center">
              Access Credentials
            </div>
            <FormRow label="Email address" error={errors?.email?.message}>
              <Input
                type="email"
                id="email"
                disabled={isWorking}
                {...register("email", {
                  required: "This field is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Please provide a valid email address",
                  },
                })}
              />
            </FormRow>

            <FormRow
              label="Password (min 6 chars)"
              error={errors?.password?.message}
            >
              <Input
                type="password"
                id="password"
                disabled={isWorking}
                {...register("password", {
                  required: "This field is required",
                  minLength: {
                    value: 6,
                    message: "Password needs a minimum of 6 characters",
                  },
                })}
              />
            </FormRow>
            <FormRow
              label="Repeat password"
              error={errors?.passwordConfirm?.message}
            >
              <Input
                type="password"
                id="passwordConfirm"
                disabled={isWorking}
                {...register("passwordConfirm", {
                  required: "This field is required",
                  validate: (value) =>
                    value === getValues().password || "Passwords need to match",
                })}
              />
            </FormRow>
          </>
        )}
      </div>
      <FormRowButton>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>

        {/* {!isEditSession ? ( */}
        <Button disabled={isWorking}>
          <div className="flex justify-center items-center">
            {!isWorking ? <FaRegSave className="mr-2" /> : <SpinnerMini />}

            {isEditSession ? "Edit user" : "Create new user"}
          </div>
        </Button>
        {/* ) : null} */}
      </FormRowButton>
    </Form>
  );
}

export default SignupFormStaff;
