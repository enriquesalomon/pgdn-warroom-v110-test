import React from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import ServicesBeneficiaryTable from "../features/reports/rpt_ServicesBeneficiaries/components/ServicesBeneficiaryTable";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { parsePage } from "../utils/helpers";
import BarangayFilterAll from "../ui/BarangayFilterAll";
import ListFilter from "../features/reports/rpt_ServicesBeneficiaries/components/ListFilter";
import AssistanceTypeFilter from "../ui/AssistanceTypeFilter";
import { useAssType } from "../features/asstype/hooks/useAssType";
import PrecinctFilter from "../ui/PrecinctFilter";
import Select, { components } from "react-select";
import { useFirstSelectData } from "../features/teams/hooks/useData";
import styled from "styled-components";
import ElectoratesTable from "../features/non-team-validation/components/ElectoratesTable";
import { useValidationSettings_Running } from "../features/team-validation/hooks/useValitionSettings";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "green" : "white", // Background color of each option
    color: state.isDisabled ? "green" : "black",
    width: "100%", // Width of each option
    "&:hover": {
      backgroundColor: "green", // Background color when hovering
      color: "white", // Text color when hovering
    },
  }),
};

const NonTeamValidation = () => {
  const { data, isLoading: firstLoading, error } = useFirstSelectData();
  const { pagePermission } = usePagePermissionContext();
  const { isPending, asstype, count } = useAssType();
  console.log("xxxx ass", asstype);
  const firstData = data?.data || [];

  const { validation_settings = {} } = useValidationSettings_Running();
  let validation_name;
  if (validation_settings.length > 0) {
    validation_name = validation_settings[0].validation_name;
  }

  // const data_clustered = useMemo(
  //   () => data?.data_clustered || [],
  //   [data?.data_clustered]
  // );

  // if (!isAllowed) {
  //   return <UnAuthorized headerText="Page Not Found" />;
  // }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">NON-TEAM VALIDATION</Heading>

        <BarangayFilterAll />
      </Row>

      <hr className="border-t-1 border-gray-300" />
      <Row type="horizontal">
        <div></div>
        <PrecinctFilter />
      </Row>
      <div
        className={`px-4 py-2 rounded-md  shadow-lg ${
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
      <hr className="border border-gray-300" />

      <Row>
        <ElectoratesTable validation_name={validation_name} />
      </Row>
    </>
  );
};

export default NonTeamValidation;
