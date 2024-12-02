import Button from "../../../../ui/Button";
import Modal from "../../../../ui/Modal";
import SignupFormPL from "./SignupFormPL";
import React, { useState } from "react";
import { useTeams } from "../../../teams/hooks/useTeamSearchAll";
import { HiPlus } from "react-icons/hi2";
function AddUserPL() {
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
              Add new PL User
            </div>
          </Button>
        </Modal.Open>
        <Modal.Window
          backdrop={true}
          name="user-form"
          heightvar={isAppUser ? "85%" : "100%"}
        >
          <SignupFormPL
            onChangeAccessType={handleAccessTypeChange}
            teams={teams}
          />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddUserPL;
