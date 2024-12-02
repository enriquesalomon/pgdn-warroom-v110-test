import Button from "../../../ui/Button";
import Modal from "../../../ui/Modal";
import PrecinctForm from "./PrecinctForm";
import { HiPlus } from "react-icons/hi2";
function AddPrecinct() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="baco-form">
          <Button>
            <div className="flex justify-center items-center">
              <HiPlus className="mr-2" />
              Add new Precinct
            </div>
          </Button>
        </Modal.Open>
        <Modal.Window backdrop={true} name="baco-form" heightvar="35%">
          <PrecinctForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddPrecinct;
