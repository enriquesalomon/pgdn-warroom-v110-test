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

const RptServicesBeneficiaryPage = () => {
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(pagePermission, "rpt_servicesbeneficiary");
  const { isPending, asstype, count } = useAssType();
  console.log("xxxx ass", asstype);
  // const data_clustered = useMemo(
  //   () => data?.data_clustered || [],
  //   [data?.data_clustered]
  // );

  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">LIST OF BENEFICIARY</Heading>

        <BarangayFilterAll />
      </Row>
      <hr className="border-t-1 border-gray-300" />
      <Row type="horizontal">
        <div></div>
        <AssistanceTypeFilter option={asstype} />
      </Row>
      <Row type="horizontal">
        <div></div>
        <ListFilter />
      </Row>

      <div className="pt-4 min-h-screen">
        <ServicesBeneficiaryTable />
      </div>
    </>
  );
};

export default RptServicesBeneficiaryPage;
