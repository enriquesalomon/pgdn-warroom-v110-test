import Button from "../../../../ui/Button";
import Modal from "../../../../ui/Modal";
import SignupForm from "./SignupForm";
import React, { useState } from "react";
import { useTeams } from "../../../teams/hooks/useTeamSearchAll";
import { HiPlus } from "react-icons/hi2";
function AddUser() {
  const [isAppUser, setIsAppUser] = useState(false);
  const { teams } = useTeams();
  const handleAccessTypeChange = (accountrole) => {
    // Check if the accesstype is "App User"
    setIsAppUser(accountrole === "Validator");
  };
  return (
    <div>
      <Modal>
        <Modal.Open opens="user-form">
          <Button>
            <div className="flex justify-center items-center">
              <HiPlus className="mr-2" />
              Add new Portal User
            </div>
          </Button>
        </Modal.Open>
        {/* <Modal.Window backdrop={true} name="asst-form" heightvar="35%"></Modal.Window> */}
        <Modal.Window
          backdrop={true}
          name="user-form"
          heightvar={isAppUser ? "85%" : "100%"}
        >
          <SignupForm
            onChangeAccessType={handleAccessTypeChange}
            teams={teams}
          />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddUser;
