import Button from "../../../ui/Button";
import Modal from "../../../ui/Modal";
import EvenTypeForm from "./EvenTypeForm";
import { HiPlus } from "react-icons/hi2";
function AddEventType() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="event-form">
          <Button>
            <div className="flex justify-center items-center">
              <HiPlus className="mr-2" />
              Add new Event Type
            </div>
          </Button>
        </Modal.Open>
        <Modal.Window
          backdrop={true}
          name="event-form"
          heightvar="50%"
          widthvar="45%"
        >
          <EvenTypeForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddEventType;
