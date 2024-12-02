import Button from "../../../ui/Button";
import Modal from "../../../ui/Modal";
import CreateBeneficiaryForm from "./CreateBeneficiaryForm";
import { HiPlus } from "react-icons/hi2";
function AddBeneficiary() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="service-form">
          <Button>
            <div className="flex justify-center items-center">
              <HiPlus className="mr-2" />
              Add new
            </div>
          </Button>
        </Modal.Open>
        <Modal.Window backdrop={true} name="service-form" heightvar="85%">
          <CreateBeneficiaryForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddBeneficiary;
