import Button from "../../../ui/Button";
import Modal from "../../../ui/Modal";
import AssTypeForm from "./AssTypeForm";
import { HiPlus } from "react-icons/hi2";
function AddAssType() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="asst-form">
          <Button>
            <div className="flex justify-center items-center">
              <HiPlus className="mr-2" />
              Add new Assistance Type
            </div>
          </Button>
        </Modal.Open>
        <Modal.Window backdrop={true} name="asst-form" heightvar="35%">
          <AssTypeForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddAssType;
