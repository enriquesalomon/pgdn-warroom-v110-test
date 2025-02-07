import Button from "../../../ui/Button";
import Modal from "../../../ui/Modal";
import { HiPlus } from "react-icons/hi2";
import ElectoratesTable from "./ElectoratesTable";
import { useDebounce } from "use-debounce";
import { useElectoratesPer_Brgy2 } from "../../electorate/hooks/useElectorates";
import { useState } from "react";
function AddAttendees() {
  const [searchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { electorates } = useElectoratesPer_Brgy2(debouncedSearchTerm);
  return (
    <div>
      <Modal>
        <Modal.Open opens="service-form">
          <Button>
            <div className="flex justify-center items-center">
              <HiPlus className="mr-2" />
              Add new attendeess
            </div>
          </Button>
        </Modal.Open>
        <Modal.Window backdrop={true} name="service-form" heightvar="85%">
          {/* <CreateForm /> */}

          <ElectoratesTable
            electorates={electorates}
            // onSelectElectorate={handleElectorateSelect}
            // onCloseModal={onCloseModal}
          />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddAttendees;
