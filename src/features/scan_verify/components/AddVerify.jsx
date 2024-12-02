import Button from "../../../ui/Button";
import Modal from "../../../ui/Modal";
import { useFetchSettings } from "../../request/hooks/useRequest";
import VotersForm from "./VotersForm";
import { HiPlus } from "react-icons/hi2";

function AddVerify() {
  const { data: ValidationSettings } = useFetchSettings();

  if (ValidationSettings?.length > 0) {
    const id = ValidationSettings[0].id;
    console.log("settingsss", id);
  } else {
    console.log("Data array is empty");
  }

  return (
    <div>
      <Modal>
        <Modal.Open opens="baco-form">
          <Button>
            <div className="flex justify-center items-center">
              <HiPlus className="mr-2" />
              Verify New Voter
            </div>
          </Button>
        </Modal.Open>
        <Modal.Window backdrop={true} name="baco-form" heightvar="90%">
          <VotersForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddVerify;
