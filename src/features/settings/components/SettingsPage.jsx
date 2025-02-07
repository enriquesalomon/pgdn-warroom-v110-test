import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import Input from "../../../ui/Input";
import Spinner from "../../../ui/Spinner";
import { useCheckRequestPending, useSettings } from "../hooks/useSettings";
import { useValidationSettings } from "../hooks/useValitionSettings";
import { useUpdateSetting } from "../hooks/useUpdateSetting";
import { insertLogs } from "../../../utils/recordUserActivity";
import { useQueryClient } from "@tanstack/react-query";
import Tab from "./Tab";
import { useState } from "react";
import { IoSettingsSharp } from "react-icons/io5";
import Modal from "../../../ui/Modal";
import ValidationSettingsForm from "./ValidationSettingsForm";
import { format } from "date-fns";
import { useEffect } from "react";
import { useEditValidationSettings } from "../hooks/useEditValidationSettings";
import Tag from "../../../ui/Tag";
import styled from "styled-components";
import Row from "../../../ui/Row";
import Heading from "../../../ui/Heading";
import SectorTable from "../../sector/components/SectorTable";
import AssTypeTable from "../../asstype/components/AssTypeTable";
// import PrecinctTab from "../../clustered-precincts/components/PrecinctTab";
import EventTypeTable from "../../event-type/components/EventTypeTable";
import PrecinctTable from "./../../clustered-precincts/components/PrecinctTable";
const StyledCard = styled.div`
  border: 1px solid var(--color-grey-200);

  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

function SettingsPage() {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const {
    isPending,
    settings: {
      projected_turnout,
      projected_winning_votes,
      projected_pl,
      projected_members,
      max_teammembers_included_leader,
    } = {},
  } = useSettings();
  const { requests } = useCheckRequestPending();

  const { isPending2, validation_settings = {} } = useValidationSettings();
  const { isUpdating, updateSetting } = useUpdateSetting();
  const { isEditing, editValidation } = useEditValidationSettings();

  if (isPending && isPending2) return <Spinner />;

  const tabs = [
    {
      title: "Validation Configuration",
      content: (
        <div>
          <div className=" mb-5 flex text-2xl font-semibold mt-12">
            CONFIGURATION
          </div>
          <hr className="border-t-1 border-gray-300" />
          <div className="flex justify-items-center">
            {!isPending2 && validation_settings ? (
              <ValidationTab
                requests={requests}
                userData={userData}
                validations={validation_settings}
                width="w-1/2"
                editValidation={editValidation}
                isEditing={isEditing}
              />
            ) : null}
          </div>
        </div>
      ),
    },
    // {
    //   title: "Data Analysis",
    //   content: (
    //     <div>
    //       <DataAnalysisTab
    //         userData={userData}
    //         projected_turnout={projected_turnout}
    //         projected_winning_votes={projected_winning_votes}
    //         projected_pl={projected_pl}
    //         projected_members={projected_members}
    //         max_teammembers_included_leader={max_teammembers_included_leader}
    //         isUpdating={isUpdating}
    //         updateSetting={updateSetting}
    //       />
    //     </div>
    //   ),
    // },
    {
      title: "Sector",
      content: (
        <div>
          <SectorTab />
        </div>
      ),
    },
    {
      title: "Assistance Type",
      content: (
        <div>
          <AssTypeTab />
        </div>
      ),
    },
    {
      title: "Precinct",
      content: (
        <div>
          <PrecinctTab />
        </div>
      ),
    },
    {
      title: "Event Type",
      content: (
        <div>
          <EventTypeTab />
        </div>
      ),
    },
  ];
  return (
    <>
      <Tab tabs={tabs} />
    </>
  );
}

const ValidationTab = ({
  validations = [],
  width,
  editValidation,
  userData,
  isEditing,
  requests,
}) => {
  const [toggles, setToggles] = useState(
    Array.isArray(validations)
      ? validations.map((validation) => validation && validation.isrunning)
      : []
  );
  console.log("validation json", JSON.stringify(validations));
  const toggleSwitch = (index) => {
    const currentState = toggles[index];
    let alertMessage = "";

    // Check if there are other validations with isrunning set to true
    const otherRunningValidations = toggles.some(
      (toggle, i) => toggle && i !== index
    );

    let confirmation = false;
    console.log("currentState json", JSON.stringify(currentState));
    console.log("validation id", JSON.stringify(validations[index].id));
    if (validations[index].islock === false) {
      if (!currentState && otherRunningValidations) {
        // //checking if no requests is pending
        // if (requests.data && requests.data.length > 0) {
        //   alert(
        //     "You can't turn this validation on because there are still Pending Requests need to be completed."
        //   );
        //   return null;
        // }

        alert(
          "You can't turn this validation on because other validations are still running."
        );
      } else {
        if (currentState) {
          alertMessage =
            "Are you sure you want to turn this " +
            validations[index].validation_name +
            " validations off.?";
        } else {
          alertMessage =
            "Are you sure you want to turn this " +
            validations[index].validation_name +
            " validations on.?";
        }
        confirmation = window.confirm(alertMessage);
      }
    } else {
      alert("You can't turn this validation on because it is already locked.");
    }

    if (confirmation) {
      // Save toggle value to the database
      saveToggleValueToDatabase(
        validations[index].id,
        !currentState,
        validations[index].validation_name
      );

      !isEditing &&
        setToggles((prevToggles) => {
          const newToggles = [...prevToggles];
          newToggles[index] = !newToggles[index];
          return newToggles;
        });
    }
  };

  const saveToggleValueToDatabase = (validationId, toggleValue, vname) => {
    const edited = editValidation({
      newData: { isrunning: toggleValue, isactive: true },
      id: validationId,
    });

    const toggle_stats = toggleValue ? "turning on" : "turning off";
    const params = {
      page: "Settings (Validation)",
      action: `User is ${toggle_stats} the ${vname}`,
      user_id: userData.id,
    };
    insertLogs(params);
  };

  useEffect(() => {}, [toggles]);

  return (
    <>
      {validations &&
        validations.length > 0 &&
        validations.map((validation, index) => (
          <StyledCard
            key={validation.id}
            className={`bg-gray-100 p-4 rounded-lg shadow-md ${width}  p-4 m-4`}
          >
            <div className="flex items-center justify-between flex-wrap">
              <p className="text-sm sm:text-2xl font-semibold uppercase">
                {validation.validation_name}
              </p>

              <label
                htmlFor={`toggle-${validation.id}`}
                className="flex items-center cursor-pointer"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    id={`toggle-${validation.id}`}
                    className="sr-only"
                    checked={toggles[index]}
                    onChange={() => toggleSwitch(index)}
                  />
                  <div className="block bg-gray-200 w-16 h-8 rounded-full">
                    <div
                      className={`absolute left-0 w-8 h-8 rounded-full shadow-md transform transition-transform duration-300 ${
                        toggles[index]
                          ? "bg-green-800 translate-x-8"
                          : "bg-gray-400"
                      }`}
                    ></div>
                  </div>
                </div>
              </label>
            </div>

            {validation.validation_name === "Final Validation" ? (
              <p className="text-sm sm:text-2xl font-light uppercase text-emerald-600">
                ELECTION DAY
              </p>
            ) : (
              ""
            )}

            <div className="flex justify-between mt-8">
              <div>
                <span className="text-sm sm:text-2xl ">
                  PERIOD:{" "}
                  {validation.start_date && validation.end_date ? (
                    <>
                      {format(new Date(validation.start_date), "MMM dd yyyy")}{" "}
                      &rarr;{" "}
                      {format(new Date(validation.end_date), "MMM dd yyyy")}
                    </>
                  ) : (
                    "N/A"
                  )}
                </span>
                <div>
                  <span className="text-sm sm:text-2xl ">
                    {/* STATUS: {toggles[index] ? "ON" : "OFF"} */}
                    STATUS:{" "}
                    {toggles[index] === true && <Tag type="green"> ON</Tag>}
                    {toggles[index] === false && <Tag type="red">OFF</Tag>}{" "}
                    {validation.islock === true && <Tag type="red">LOCKED</Tag>}
                  </span>
                </div>
              </div>

              <Modal>
                <Modal.Open opens="service-form">
                  <div className="text-green-300 flex text-2xl justify-center items-center hover:bg-[#229954] hover:text-white hover:cursor-pointer font-bold py-2 px-4 rounded ">
                    <IoSettingsSharp className="text-sm sm:text-4xl" />
                  </div>
                </Modal.Open>
                <Modal.Window
                  backdrop={true}
                  name="service-form"
                  heightvar="50%"
                  widthvar="45%"
                >
                  <ValidationSettingsForm
                    validationtoEdit={validation}
                    // electorates={electorates}
                  />
                </Modal.Window>
              </Modal>
            </div>
          </StyledCard>
        ))}
    </>
  );
};

const DataAnalysisTab = ({
  projected_turnout,
  isUpdating,
  updateSetting,
  projected_winning_votes,
  projected_pl,
  projected_members,
  max_teammembers_included_leader,
  userData,
}) => {
  function handleUpdate(e, field) {
    const { value } = e.target;
    if (!value) return;
    updateSetting({ [field]: value });
    const action = `User updated the ${field} data`;
    const params = {
      page: "Settings (Data Analysis)",
      action: action,
      parameters: { [field]: value },
      user_id: userData.id,
    };
    insertLogs(params);
  }

  return (
    <>
      <div className=" mb-5 flex text-3xl font-semibold mt-12"></div>
      <hr className="border-t-1 border-gray-300 mt-2 mb-4" />
      <Form>
        <div className="mb-5 flex text-m font-semibold">Data Analysis</div>

        {/* <FormRow label="% Projected Turnout">
        <Input
          type="number"
          id="min-nights"
          defaultValue={projected_turnout}
          // disabled={isUpdating}
          disabled
          onBlur={(e) => handleUpdate(e, "projected_turnout")}
        />
      </FormRow> */}

        <FormRow label="% Projected Winning Votes">
          <Input
            type="number"
            id="max-nights"
            defaultValue={projected_winning_votes}
            // disabled={isUpdating}
            disabled
            onBlur={(e) => handleUpdate(e, "projected_winning_votes")}
          />
        </FormRow>

        {/* <FormRow label="# Projected PL">
        <Input
          type="number"
          id="max-guests"
          defaultValue={projected_pl}
          disabled
          onBlur={(e) => handleUpdate(e, "projected_pl")}
        />
      </FormRow>

      <FormRow label="# Projected Members">
        <Input
          type="number"
          id="breakfast-price"
          defaultValue={projected_members}
          disabled
          onBlur={(e) => handleUpdate(e, "projected_members")}
        />
      </FormRow> */}

        <FormRow label="Max # of Team Members Including the leader">
          <Input
            type="number"
            id="breakfast-price"
            defaultValue={max_teammembers_included_leader}
            // disabled={isUpdating}
            disabled
            onBlur={(e) => handleUpdate(e, "max_teammembers_included_leader")}
          />
        </FormRow>
      </Form>
    </>
  );
};

const SectorTab = () => {
  return (
    <>
      <div className="mt-12 ">
        <div className=" mb-5 flex text-2xl font-semibold mt-12">SECTOR</div>

        <hr className="border-t-1 border-gray-300" />
        <Row className="mt-6">
          <SectorTable />
        </Row>
      </div>
    </>
  );
};

const AssTypeTab = () => {
  return (
    <>
      <div className="mt-12">
        <div className=" mb-5 flex text-2xl font-semibold mt-12">
          ASSISTANCE TYPE
        </div>

        <hr className="border-t-1 border-gray-300" />
        <Row className="mt-6">
          <AssTypeTable />
        </Row>
      </div>
    </>
  );
};
const PrecinctTab = () => {
  return (
    <>
      <div className="mt-12">
        <div className=" mb-5 flex text-2xl font-semibold mt-12">PRECINCT</div>

        <hr className="border-t-1 border-gray-300" />
        <Row className="mt-6">
          <PrecinctTable />
        </Row>
      </div>
    </>
  );
};

const EventTypeTab = () => {
  return (
    <>
      <div className="mt-12">
        <div className=" mb-5 flex text-2xl font-semibold mt-12">
          EVENT TYPE
        </div>

        <hr className="border-t-1 border-gray-300" />
        <Row className="mt-6">
          <EventTypeTable />
        </Row>
      </div>
    </>
  );
};

export default SettingsPage;
