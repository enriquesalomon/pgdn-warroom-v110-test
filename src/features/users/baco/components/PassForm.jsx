import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../../../../ui/Button";
import Form from "../../../../ui/Form";
import FormRow from "../../../../ui/FormRow";
import Input from "../../../../ui/Input";
import { decryptPassword } from "../../../../utils/cryptoUtils";
import SpinnerMini from "../../../../ui/SpinnerMini";
import { useQueryClient } from "@tanstack/react-query";
import { FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";
function PassForm({ userToEdit = {}, onCloseModal, onValidationSuccess }) {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const logged_user_pass = queryClient.getQueryData([
    "user_loggedIn",
    userData.id,
  ]);
  const {
    id: editId,
    // email,
    page_permission,
    action_permission,
    team_id,
    user_pass,
    ...editValues
  } = userToEdit;

  const isEditSession = Boolean(editId);
  // const hasemail = email;
  const { register, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  const [decryptPass, setDecryptPass] = useState("");
  const [validationInput, setValidationInput] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    // Decrypt the user_pass field
    let pass = "";
    if (user_pass) {
      pass = decryptPassword(user_pass);
      setDecryptPass(pass);
    }
  }, [user_pass]);

  const handleValidationSubmit = async () => {
    let logged_pass = "";
    setIsWorking(true);
    if (logged_user_pass.user_pass) {
      logged_pass = decryptPassword(logged_user_pass.user_pass);
    }

    setTimeout(() => {
      // Perform validation after the delay
      if (logged_pass === validationInput) {
        onValidationSuccess();
        setIsPasswordVisible(true);
        setValidationInput("");
      } else {
        // alert("Validation failed. Please try again.");
        toast.error("Validation failed. Please try again.");
      }
      setValidationInput("");
      setIsWorking(false);
    }, 2000); // Delay of 2000 milliseconds (2 seconds)
  };
  return (
    <Form
      type={onCloseModal ? "modal" : "regular"}
      style={{ width: "100%" }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault(); // This prevents the default form submission on Enter key press
        }
      }}
    >
      <div className="grid gap-4">
        {isPasswordVisible ? (
          <>
            <div className="font-medium mt-12 flex justify-center">
              Access Credentials
            </div>

            <FormRow label="Full name" error={errors?.fullname?.message}>
              <Input
                readOnly
                type="text"
                id="fullname"
                {...register("fullname", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <FormRow label="Email address" error={errors?.email?.message}>
              <Input
                readOnly
                type="email"
                id="email"
                {...register("email", {
                  required: "This field is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Please provide a valid email address",
                  },
                })}
              />
            </FormRow>
            <FormRow label="Password" error={errors?.password?.message}>
              <Input
                id="password"
                type="text"
                value={decryptPass}
                readOnly
                style={{ flexGrow: 1 }}
              />
            </FormRow>
          </>
        ) : (
          <>
            <div className="font-medium mt-12 flex justify-center">
              Verify your password to proceed
            </div>
            <FormRow label="Your Password">
              <div style={{ display: "flex", alignItems: "center" }}>
                <Input
                  id="validationInput"
                  type="password"
                  value={validationInput}
                  onChange={(e) => setValidationInput(e.target.value)}
                  style={{ flexGrow: 1 }}
                />
              </div>
            </FormRow>
            <Button
              disabled={isWorking}
              type="button"
              onClick={handleValidationSubmit}
            >
              <div className="flex justify-center items-center">
                {!isWorking ? (
                  <FaCheckCircle className="mr-2" />
                ) : (
                  <SpinnerMini />
                )}
                Verify
              </div>
            </Button>
          </>
        )}
      </div>
    </Form>
  );
}

export default PassForm;
