import Button from "../../../ui/Button";
import Modal from "../../../ui/Modal";
import BacoForm from "./BacoForm";
import { HiPlus } from "react-icons/hi2";
function AddBaco() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="baco-form">
          <Button>
            <div className="flex justify-center items-center">
              <HiPlus className="mr-2" />
              Add new baco
            </div>
          </Button>
        </Modal.Open>
        <Modal.Window backdrop={true} name="baco-form" heightvar="90%">
          <BacoForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddBaco;
