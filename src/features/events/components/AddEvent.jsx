import Button from "../../../ui/Button";
import Modal from "../../../ui/Modal";
import { useEventType } from "../hooks/useEvent";
import EventForm from "./EventForm";
import { HiPlus } from "react-icons/hi2";
function AddEvent() {
  const { eventtype } = useEventType();
  return (
    <div>
      <Modal>
        <Modal.Open opens="event-form">
          <Button>
            <div className="flex justify-center items-center">
              <HiPlus className="mr-2" />
              Add new Event
            </div>
          </Button>
        </Modal.Open>
        <Modal.Window
          backdrop={true}
          name="event-form"
          heightvar="70%"
          widthvar="45%"
        >
          <EventForm eventtype={eventtype} />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddEvent;
