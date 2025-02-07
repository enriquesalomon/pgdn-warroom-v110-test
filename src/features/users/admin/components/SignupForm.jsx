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
import CheckboxListAction from "../../CheckBoxListAction";
import CheckboxList from "../../CheckBoxList";
import { useEditUser } from "../hooks/useEditUser";
import { encryptPassword } from "../../../../utils/cryptoUtils";
import {
  pageOptions,
  actionOptions,
  actionOptions_staff,
  actionOptions_administrator,
  pageOptions_administrator,
  pageOptions_staff,
  brgy_allow,
  // account_role,
} from "../../../../utils/constants";
import { FaRegSave } from "react-icons/fa";

import Select from "react-select";

import { insertLogs } from "../../../../utils/recordUserActivity";
import { parseAction } from "../../../../utils/helpers";
import SpinnerMini from "../../../../ui/SpinnerMini";
import Modal from "../../../../ui/Modal";
import { HiMagnifyingGlass } from "react-icons/hi2";
import CheckBoxListBrgy from "../../CheckBoxListBrgy";
import { GrConfigure } from "react-icons/gr";
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

const CheckBorder = styled.div`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
`;
function SignupForm({
  userToEdit = {},
  onCloseModal,
  onChangeAccessType,
  teams,
}) {
  console.log("userToeadasd", userToEdit);
  let account_role = ["Super Admin", "Administrator", "Staff"];
  let account_role_app = ["Mayor"];
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);

  if (userData.user_metadata.account_role === "Administrator") {
    account_role = account_role.filter((role) => role !== "Super Admin");
  }
  if (userData.user_metadata.account_role === "Staff") {
    account_role = account_role.filter(
      (role) => role !== "Super Admin" && role !== "Administrator"
    );
  }

  const { signup, isPending } = useSignup();
  const { isEditing, editUser } = useEditUser();
  const isWorking = isPending || isEditing;
  const { actionPermission } = useActionPermissionContext();
  let result = parseAction(actionPermission, "update admin user");
  let isAllowedAction;
  if (!result) {
    isAllowedAction = parseAction(actionPermission, "add admin user");
  } else {
    isAllowedAction = result;
  }
  const {
    id: editId,
    email,
    page_permission,
    action_permission,
    team_id,
    allowed_view_brgy,
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
  const [selectedBrgyAllows, setSelectedBrgyAllows] = useState([]);
  const handleSelectedOptionsChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };
  const handleSelectedActionsChange = (selectedActions) => {
    setSelectedActions(selectedActions);
  };
  const handleSelectedAllowBrgyChange = (selectedActions) => {
    setSelectedBrgyAllows(selectedActions);
  };

  const selectedRole = watch("account_role");

  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (selectedRole === "Super Admin") {
      setIsSuperAdmin(true);
      setIsAdmin(false);
    } else if (selectedRole === "Administrator") {
      setIsAdmin(true);
      setIsSuperAdmin(false);
    } else {
      setIsSuperAdmin(false);
      setIsAdmin(false);
    }
  }, [selectedRole]);
  // const handleRoleChange = (role) => {
  //   // Your custom function logic here
  //   console.log("Selected role:", role);
  // };

  useEffect(() => {
    const initialSelectedOptions = JSON.parse(page_permission || "[]");
    setSelectedOptions(initialSelectedOptions);
  }, [page_permission]);
  useEffect(() => {
    const initialSelectedActions = JSON.parse(action_permission || "[]");
    setSelectedActions(initialSelectedActions);
  }, [action_permission]);
  useEffect(() => {
    const initialSelecteBrgy = JSON.parse(allowed_view_brgy || "[]");
    setSelectedBrgyAllows(initialSelecteBrgy);
  }, [allowed_view_brgy]);
  useEffect(() => {
    // Send the accesstype value to the parent component
    onChangeAccessType && onChangeAccessType(watch("account_role"));
  }, [onChangeAccessType, watch]);

  const leader_list =
    teams && teams.data
      ? teams.data.map((team) => ({
          value: team.id,
          label: `${team.firstname || ""} ${team.lastname || ""}`,
        }))
      : [];

  const [selectedLeader, setSelectedLeader] = useState(null);

  const handleChange = (selectedLeader) => {
    setSelectedLeader(selectedLeader);
  };
  useEffect(() => {
    if (isEditSession && teams && Array.isArray(teams.data)) {
      // Check if teams.data is an array
      let filteredData = teams.data.filter(
        (item) => item.id === userToEdit.leader_id
      );
      filteredData = filteredData.map((leader) => ({
        value: leader,
        label: `${leader.precinctno} ${leader.firstname} ${leader.lastname}`,
        isFixed: leader.id !== userToEdit.leader_id ? false : true,
      }));
      setSelectedLeader(filteredData);
    }
  }, [isEditSession, teams, userToEdit]);
  const onSubmit = (data) => {
    const userData = queryClient.getQueryData(["user"]);
    const action = !isEditSession
      ? "User created a new user account"
      : "User updated user account";
    const params = {
      page: "Users",
      action: action,
      parameters: data,
      user_id: userData.id,
    };

    data.action_permission = selectedActions;
    data.page_permission = selectedOptions;
    data.allowed_view_brgy = selectedBrgyAllows;
    const encryptedPassword = encryptPassword(data.password);
    data.leader_id = selectedLeader?.value;
    if (
      selectedOptions.length === 0 ||
      selectedActions.length === 0 ||
      selectedBrgyAllows.length === 0
    ) {
      alert("Please Complete the Fields");
      return null;
    }
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
        {isEditSession ? "EDIT PORTAL USER" : "ADD NEW PORTAL USER"}
      </div>
      <div className="grid gap-4">
        <div className="font-medium mt-5 flex justify-center">Profile Info</div>
        <FormRow label="Full name" error={errors?.fullname?.message}>
          <Input
            type="text"
            id="fullname"
            disabled={isWorking}
            {...register("fullname", { required: "This field is required" })}
          />
        </FormRow>
        <FormRow label="Contact no." error={errors?.contactno?.message}>
          <Input
            type="text"
            id="contactno"
            disabled={isWorking}
            {...register("contactno", { required: "This field is required" })}
          />
        </FormRow>
        <FormRow label="Access type" error={errors?.accesstype?.message}>
          <StyledSelect
            className="hover:cursor-pointer"
            disabled={isEditSession}
            id="accesstype"
            {...register("accesstype", { required: "This field is required" })}
          >
            {/* <option value="">Select...</option> */}
            <option value="Portal User">Portal User</option>
            <option value="App User">App User</option>
          </StyledSelect>
        </FormRow>
        <FormRow label="Account role" error={errors?.account_role?.message}>
          <StyledSelect
            disabled={isEditSession}
            className="hover:cursor-pointer"
            id="account_role"
            {...register("account_role", {
              required: "This field is required",
              onChange: (e) => {
                // handleRoleChange(e.target.value);
                setValue("account_role", e.target.value);
              },
            })}
          >
            <option value="">Select...</option>
            {watch("accesstype") === "Portal User" && (
              <>
                {account_role.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </>
            )}
             {watch("accesstype") === "App User" && (
              <>
                {account_role_app.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </>
            )}
          </StyledSelect>
        </FormRow>

        {watch("account_role") === "Validator" && (
          <FormRow label="Leader" error={errors?.leaders?.message}>
            <Select
              value={selectedLeader}
              onChange={handleChange}
              options={leader_list}
              isEditSession
              menuPlacement={isEditSession ? "top" : "bottom"}
              styles={customStyles}
            />
          </FormRow>
        )}

        {watch("account_role") !== "Validator" && (
          <div className="flex justify-center items-center mt-5">
            <div className="flex flex-col w-full max-w-4xl">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-4/4 p-4 rounded-lg shadow-lg">
                  Page Permission
                  <CheckBorder>
                    <CheckboxList
                      isWorking={isWorking}
                      id="page_permission"
                      // options={pageOptions}
                      options={
                        isSuperAdmin
                          ? pageOptions
                          : isAdmin
                          ? pageOptions_administrator
                          : pageOptions_staff
                      }
                      selectedOptions={selectedOptions}
                      onSelectedOptionsChange={handleSelectedOptionsChange}
                    />
                  </CheckBorder>
                  <div className="flex mt-6 justify-center">
                    <Modal>
                      <Modal.Open opens="service-form">
                        <Button
                          // disabled={isEditSession}
                          type="button"
                        >
                          <div className="flex justify-center items-center">
                            <GrConfigure className="mr-2" />
                            Set Allowed Barangays
                          </div>
                        </Button>
                      </Modal.Open>
                      <Modal.Window
                        backdrop={true}
                        name="service-form"
                        heightvar="85%"
                      >
                        <CheckBorder className="mt-12">
                          <CheckBoxListBrgy
                            isWorking={isWorking}
                            id="allowed_view_brgy"
                            // actions={(actionOptions, actionOptions_staff)}
                            actions={brgy_allow}
                            selectedActions={selectedBrgyAllows}
                            onSelectedActionsChange={
                              handleSelectedAllowBrgyChange
                            }
                          />
                        </CheckBorder>
                      </Modal.Window>
                    </Modal>
                  </div>
                </div>
                <div className="w-full md:w-4/5 p-4 rounded-lg shadow-lg mt-4 md:mt-0 ">
                  Action Permission
                  <CheckBorder>
                    <CheckboxListAction
                      isWorking={isWorking}
                      id="action_permission"
                      // actions={(actionOptions, actionOptions_staff)}
                      actions={
                        isSuperAdmin
                          ? actionOptions
                          : isAdmin
                          ? actionOptions_administrator
                          : actionOptions_staff
                      }
                      selectedActions={selectedActions}
                      onSelectedActionsChange={handleSelectedActionsChange}
                    />
                  </CheckBorder>
                </div>
                {/* <div className="w-full md:w-4/5 p-4 rounded-lg shadow-lg mt-4 md:mt-0 ">
                  Action Permission
                  <CheckBorder>
                    <CheckboxListAction
                      isWorking={isWorking}
                      id="brgy_permission"
                      // actions={(actionOptions, actionOptions_staff)}
                      actions={brgy_allow}
                      selectedActions={selectedActions}
                      onSelectedActionsChange={handleSelectedActionsChange}
                    />
                  </CheckBorder>
                </div> */}
              </div>
            </div>
          </div>
        )}

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
              label="Password (min 8 chars)"
              error={errors?.password?.message}
            >
              <Input
                type="password"
                id="password"
                disabled={isWorking}
                {...register("password", {
                  required: "This field is required",
                  minLength: {
                    value: 8,
                    message: "Password needs a minimum of 8 characters",
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

        {isAllowedAction ? (
          <Button disabled={isWorking}>
            <div className="flex justify-center items-center">
              {!isWorking ? <FaRegSave className="mr-2" /> : <SpinnerMini />}

              {isEditSession ? "Edit user" : "Create new user"}
            </div>
          </Button>
        ) : null}
      </FormRowButton>
    </Form>
  );
}

export default SignupForm;
