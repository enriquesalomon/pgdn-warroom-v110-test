import Button from "../../../ui/Button";
import Modal from "../../../ui/Modal";
import CreateTeamForm from "./CreateTeamForm";
import { useSettings } from "../../settings/hooks/useSettings";
import { HiPlus } from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";
function AddTeam(ValidationSettings) {
  const { settings } = useSettings();
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy");
  console.log("ValidationSettingssss-----", JSON.stringify(ValidationSettings));
  return (
    <div>
      {brgy && (
        <Modal>
          <Modal.Open opens="team-form">
            <Button>
              <div className="flex justify-center items-center">
                <HiPlus className="mr-2" />
                Add new Team
              </div>
            </Button>
          </Modal.Open>

          <Modal.Window
            backdrop={true}
            name="team-form"
            heightvar="100%"
            widthvar="100%"
          >
            <CreateTeamForm
              brgy={brgy}
              ValidationSettings={ValidationSettings}
              settings={settings}
            />
          </Modal.Window>
        </Modal>
      )}
    </div>
  );
}

export default AddTeam;
