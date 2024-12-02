import { useState } from "react";

import Button from "../../../ui/Button";
import FileInput from "../../../ui/FileInput";
import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import Input from "../../../ui/Input";

import { useUser } from "../hooks/useUser";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { insertLogs } from "../../../utils/recordUserActivity";
import { useQueryClient } from "@tanstack/react-query";

function UpdateUserDataForm() {
  const queryClient = useQueryClient();
  // We don't need the loading state, and can immediately use the user data, because we know that it has already been loaded at this point
  const {
    user: {
      email,
      user_metadata: { fullname: currentfullname },
    },
  } = useUser();

  const { updateUser, isUpdating } = useUpdateUser();

  const [fullname, setfullname] = useState(currentfullname);
  const [avatar, setAvatar] = useState(null);

  function handleSubmit(e) {
    const userData = queryClient.getQueryData(["user"]);
    const params = {
      page: "My Profile",
      action: "User updated his/her profile",
      parameters: { fullname, avatar },
      user_id: userData.id,
    };

    e.preventDefault();
    if (!fullname) return;
    updateUser(
      { fullname, avatar },
      {
        onSuccess: () => {
          insertLogs(params);
          setAvatar(null);
          e.target.reset();
        },
      }
    );
  }

  function handleCancel() {
    setfullname(currentfullname);
    setAvatar(null);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>

      <FormRow label="Full name">
        <Input
          type="text"
          value={fullname}
          onChange={(e) => setfullname(e.target.value)}
          id="fullname"
          disabled={isUpdating}
        />
      </FormRow>

      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
          disabled={isUpdating}
        />
      </FormRow>

      <FormRow>
        <Button
          type="reset"
          variation="secondary"
          disabled={isUpdating}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
