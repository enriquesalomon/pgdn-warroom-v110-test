import Button from "../../../ui/Button";
import Modal from "../../../ui/Modal";
import SpecialElectorateForm from "./SpecialElectorateForm";
import { HiPlus } from "react-icons/hi2";
function AddSpecialElectorate() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="baco-form">
          <Button>
            <div className="flex justify-center items-center">
              <HiPlus className="mr-2" />
              Tag new special electorate
            </div>
          </Button>
        </Modal.Open>
        <Modal.Window backdrop={true} name="baco-form" heightvar="90%">
          <SpecialElectorateForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddSpecialElectorate;
