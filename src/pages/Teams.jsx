import Heading from "../ui/Heading";
import Row from "../ui/Row";
// import AddLeader from "../features/leaders/components/AddLeader";
// import LeaderTableOperations from "../features/leaders/components/LeaderTableOperations";
// import LeaderTable from "../features/leaders/components/LeaderTable";

import AddTeam from "../features/teams/components/AddTeam";
import TeamTable from "../features/teams/components/TeamTable";

import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { useActionPermissionContext } from "../context/ActionPermissionContext";

import { parseAction, parsePage } from "../utils/helpers";
import BarangayFilter from "../ui/BarangayFilter";
import { useFetchSettings } from "../features/request/hooks/useRequest";
import { FaCircleInfo } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";

function Leaders() {
  const viewable_brgy = localStorage.getItem("viewable_brgy");
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(pagePermission, "teams");
  const { actionPermission } = useActionPermissionContext();
  const isAllowedAction = parseAction(actionPermission, "add team");
  const { data: ValidationSettings } = useFetchSettings();
  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  console.log("ni select og members", JSON.stringify(ValidationSettings));
  let notitext;
  let isFinalValidation;
  if (ValidationSettings?.length > 0) {
    isFinalValidation = ValidationSettings[0].id === 4;
    notitext = isFinalValidation
      ? "Election Day has begun. Adding and updating team members has already been deactivated."
      : "";
  }
  console.log("sa team table isFinalValidation", isFinalValidation);
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">TEAMS</Heading>
        <BarangayFilter viewable_brgy={viewable_brgy} />
      </Row>

      {isFinalValidation ? (
        <>
          <div
            className={`px-4 py-2 rounded-md shadow-lg ${
              !ValidationSettings?.[0]?.validation_name
                ? "bg-yellow-500"
                : "bg-yellow-500"
            } text-white`}
          >
            <p className="flex items-center font-thin">
              {ValidationSettings?.[0]?.validation_name ? (
                <>
                  <FaCircleInfo className="mr-2" />
                  {notitext}
                </>
              ) : null}
            </p>
          </div>
        </>
      ) : (
        <hr className="border-t-1 border-gray-300" />
      )}
      {ValidationSettings?.length === 0 && (
        <>
          <div
            className={`px-4 py-2 rounded-md shadow-lg ${
              !ValidationSettings?.[0]?.validation_name
                ? "bg-yellow-500"
                : "bg-yellow-500"
            } text-white`}
          >
            <p className="flex items-center font-thin">
              <FaCircleInfo className="mr-2" />
              {"NO VALIDATION ROUND IS ACTIVATED"}
            </p>
          </div>
        </>
      )}

      <Row>
        {isAllowedAction &&
        !isFinalValidation &&
        ValidationSettings?.length > 0 ? (
          <AddTeam ValidationSettings={ValidationSettings} />
        ) : null}
        <TeamTable ValidationSettings={ValidationSettings} />
      </Row>
    </>
  );
}

export default Leaders;
