import React from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { parsePage } from "../utils/helpers";
import BarangayFilterAll from "../ui/BarangayFilterAll";
import ElectorateTable from "../features/team-validation/components/ElectorateTable";
import { useValidationSettings_Running } from "../features/team-validation/hooks/useValitionSettings";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";

const TeamValidation = () => {
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(pagePermission, "team_validation");
  const { validation_settings = {} } = useValidationSettings_Running();
  let validation_name;
  if (validation_settings.length > 0) {
    validation_name = validation_settings[0].validation_name;
  }

  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">VALIDATION</Heading>
        <BarangayFilterAll />
      </Row>

      {/* <Row type="horizontal">
        <div></div>
        <ListFilter />
      </Row> */}

      <div className="pt-4 min-h-screen">
        {/* <Row type="horizontal" className="mb-2">
          <Heading as="h6">
            <Tag> {validation_name} is Activated</Tag>
          </Heading>

        </Row> */}

        <div
          className={`px-4 py-2 rounded-md mb-4 shadow-lg ${
            !validation_name ? "bg-yellow-500" : "bg-green-700"
          } text-white`}
        >
          <p className="flex items-center font-thin">
            {validation_name ? (
              <>
                <FaCheckCircle className="mr-2" />
                {`${validation_name} Activated`}
              </>
            ) : (
              <>
                <FaCircleInfo className="mr-2" />{" "}
                {/* Use your chosen icon here */}
                No validation activated
              </>
            )}
          </p>
        </div>
        <hr className="border-t-1 mb-4 border-gray-300" />
        {/* <ElectorateValidatedTable /> */}
        <ElectorateTable />
      </div>
    </>
  );
};

export default TeamValidation;
