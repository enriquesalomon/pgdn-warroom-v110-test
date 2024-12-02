import Button from "../../../ui/Button";
import Modal from "../../../ui/Modal";
import LeaderForm from "./LeaderForm";
import { HiPlus } from "react-icons/hi2";
function AddLeader() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="leader-form">
          <Button>
            <div className="flex justify-center items-center">
              <HiPlus className="mr-2" />
              Add new leader
            </div>
          </Button>
        </Modal.Open>
        <Modal.Window backdrop={true} name="leader-form" heightvar="90%">
          <LeaderForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddLeader;
