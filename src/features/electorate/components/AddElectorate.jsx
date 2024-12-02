import Button from "../../../ui/Button";
import Modal from "../../../ui/Modal";
import CreateLeaderForm from "./ElectorateForm";
import { HiPlus } from "react-icons/hi2";
function AddElectorate() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="electorate-form">
          <Button>
            <div className="flex justify-center items-center">
              <HiPlus className="mr-2" />
              Add new electorate
            </div>
          </Button>
        </Modal.Open>
        <Modal.Window backdrop={true} name="electorate-form" heightvar="90%">
          <CreateLeaderForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddElectorate;
