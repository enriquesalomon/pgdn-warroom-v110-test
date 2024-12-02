import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import Search from "../../../ui/Search";
import Pagination from "../../../ui/Pagination";
import { useRequests } from "../hooks/useRequest";
import { download, generateCsv, mkConfig } from "export-to-csv";
import Button from "../../../ui/Button";
import { SiMicrosoftexcel } from "react-icons/si";
import { barangayOptions } from "../../../utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../utils/recordUserActivity";
import RequestRow from "./RequestRow";
import { useDebounce } from "use-debounce";

function RequestTableCompleted() {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const allow_export = userData.user_metadata.account_role === "Super Admin";
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term

  const { isPending, requests, count } = useRequests(
    debouncedSearchTerm,
    "NOT_PENDING"
  );
  const [searchParams] = useSearchParams();

  // 1) FILTER
  const filterValue = searchParams.get("status") || "all";

  let filteredData;
  if (filterValue === "all") filteredData = requests;
  if (filterValue === "active")
    filteredData = requests.filter((requests) => requests.status === "active");
  if (filterValue === "inactive")
    filteredData = requests.filter(
      (requests) => requests.status === "inactive"
    );
  if (filterValue === "")
    filteredData = requests.filter((requests) => requests.status === "");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  let sortedDatas = filteredData;
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const csvConfig = mkConfig({
    showTitle: true,
    title: `LIST OF COMPLETED REQUEST BRGY:${brgy} PAGE:${page}`,
    fieldSeparator: ",",
    filename: `completed_request_${brgy.toLowerCase()}_p${page}`, // export file name (without .csv)
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const params = {
    page: "REQUEST",
    action: "Exported the list of completed request to Excel File",
    parameters: "downloading excel",
    user_id: userData.id,
  };

  const exportExcel = (rows) => {
    const transformedData = rows.map((entry, index) => {
      return {
        "no.": index + 1,
        request_code: entry.request_id,
        baco_requestor:
          entry.baco.firstname +
          " " +
          entry.baco.middlename +
          " " +
          entry.baco.lastname,
        brgy: entry.brgy,
        request_type: entry.request_type,
        request_status: entry.request_status,
        confirmed_by: entry.confirmed_by,
        remarks: entry.remarks !== null ? entry.remarks : "",
      };
    });

    const rowData = transformedData;
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
    insertLogs(params);
  };

  return (
    <Menus>
      <div className="flex-row">
        <div className="w-full ">
          <Search
            terms={"Search Request Code, Request Type"}
            onChange={handleSearchChange}
            width="105rem"
          />
          {allow_export && (
            <Button
              // disabled={sortedDatas?.length === 0}
              onClick={() => exportExcel(sortedDatas)}
            >
              <div className="flex justify-center items-center">
                <SiMicrosoftexcel className="mr-2" />
                EXPORT
              </div>
            </Button>
          )}
        </div>
      </div>
      {/* <div ref={componentRef}> */}
      <Table columns="0.5fr 1.5fr 1fr 1.5fr 0.5fr 0.5fr 1fr 1fr 1.5fr 0.5fr">
        <Table.Header>
          <div>ID.</div>
          <div>Date</div>
          <div>Request Code</div>
          <div>Requestor</div>
          <div>Team Members</div>
          <div>Request Type</div>
          <div>Barangay</div>
          <div>Status</div>
          <div>Confirmed By</div>
        </Table.Header>
        {isPending ? (
          <Spinner />
        ) : (
          <>
            <Table.Body
              data={sortedDatas}
              render={(requests) => (
                <RequestRow requests={requests} key={requests.id} />
              )}
            />
            <Table.Footer>
              <Pagination count={count} />
            </Table.Footer>
          </>
        )}
      </Table>
      {/* </div> */}
    </Menus>
  );
}

export default RequestTableCompleted;