import Button from "../../../ui/Button";
import Modal from "../../../ui/Modal";
import SectorForm from "./SectorForm";
import { HiPlus } from "react-icons/hi2";
function AddSector() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="baco-form">
          <Button>
            <div className="flex justify-center items-center">
              <HiPlus className="mr-2" />
              Add new Sector
            </div>
          </Button>
        </Modal.Open>
        <Modal.Window backdrop={true} name="baco-form" heightvar="35%">
          <SectorForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddSector;
