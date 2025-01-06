import React from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { parsePage } from "../utils/helpers";
import ElectoratesTable from "../features/organized-voters/components/ElectoratesTable";
import BarangayFilterAll from "../ui/BarangayFilterAll";
import ListFilter from "../features/organized-voters/components/ListFilter";
import ListFilter2 from "../features/organized-voters/components/ListFilter2";
import ListFilter3 from "../features/organized-voters/components/ListFilter3";
import ListFilter4 from "../features/organized-voters/components/ListFilter4";
import { useSearchParams } from "react-router-dom";

const Voters = () => {
  const [searchParams] = useSearchParams();
  const id_requirments = searchParams.get("id_requirments") || "all";
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(pagePermission, "voters_ato");
  if (!isAllowed) {
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">{"LIST OF ELECTORATES ASENSO ID"}</Heading>
        <BarangayFilterAll />
      </Row>
      <hr className="border-t-1 border-gray-300" />

      <Row type="horizontal">
        <ListFilter /> <ListFilter2 />
        <ListFilter3 />
      </Row>
      {id_requirments === "incomplete" && (
        <Row type="horizontal">
          <ListFilter4 />
        </Row>
      )}

      <Row>
        <ElectoratesTable />
      </Row>
    </>
  );
};

export default Voters;
