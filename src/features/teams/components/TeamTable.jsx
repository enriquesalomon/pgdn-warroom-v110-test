import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import TeamRow from "./TeamRow";
import { useState } from "react";
import Search from "../../../ui/Search";
import Pagination from "../../../ui/Pagination";
import { useTeamsWithMembers } from "../hooks/useTeams";
import { download, generateCsv, mkConfig } from "export-to-csv";
import Button from "../../../ui/Button";
import { SiMicrosoftexcel } from "react-icons/si";
import { barangayOptions } from "../../../utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../utils/recordUserActivity";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { GrPrint } from "react-icons/gr";
import { format } from "date-fns";

function TeamTable(ValidationSettings) {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);

  const isKalasag = userData.email === "superadmin@gmail.com";
  const allow_export = userData.user_metadata.account_role === "Super Admin";
  const { isPending, teams, count } = useTeamsWithMembers();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  // 1) FILTER
  const filterValue = searchParams.get("status") || "all";

  let filteredTeams;
  if (filterValue === "all") filteredTeams = teams;
  if (filterValue === "active")
    filteredTeams = teams.filter((teams) => teams.status === "active");
  if (filterValue === "inactive")
    filteredTeams = teams.filter((teams) => teams.status === "inactive");
  if (filterValue === "")
    filteredTeams = teams.filter((teams) => teams.status === "");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  let sortedTeams = filteredTeams?.filter(
    (item) =>
      (item.firstname &&
        item.firstname.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.lastname &&
        item.lastname.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.barangay &&
        item.barangay.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.precinctno &&
        item.precinctno.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const componentRef = useRef(); // Ref to the component to print
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const csvConfig = mkConfig({
    showTitle: true,
    title: `LIST OF TEAMS BRGY:${brgy} PAGE:${page}`,
    fieldSeparator: ",",
    filename: `team_${brgy.toLowerCase()}_p${page}`, // export file name (without .csv)
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const params = {
    page: "Teams",
    action: "Exported the Teams Data to Excel File",
    parameters: "downloading excel",
    user_id: userData.id,
  };
  const exportExcel = (rows) => {
    // Transform the rows to convert `members_name` array to a string and remove `members` field
    const transformedRows = rows.map((row) => {
      const {
        members,
        image,
        contactno,
        gender,
        status,
        electorate_id,
        request_id,
        gm_id,
        agm_id,
        elite_id,
        legend_id,
        baco_id,
        ...rest
      } = row; // Destructure to remove `members`
      if (Array.isArray(row.members_name)) {
        return {
          ...rest,
          members_name: row.members_name
            .map((member) => member.label)
            .join(", "),
          position: "Tower", // Change the position value
        };
      }
      return {
        ...rest,
        position: "Tower", // Change the position value
      };
    });

    // Generate and download the CSV
    const csv = generateCsv(csvConfig)(transformedRows);
    download(csvConfig)(csv);
    insertLogs(params);
  };
  // Print handler using react-to-print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current, // The ref to the component you want to print
    documentTitle: "Electorates Data", // Optional document title for the printed file
  });
  return (
    <Menus>
      <div className="flex-row">
        <div className="w-full ">
          <Search
            width="107rem"
            terms={"Search Name, Barangay, Precinct #"}
            onChange={handleSearchChange}
          />
          {(allow_export || isKalasag) && (
            // <Button
            //   disabled={sortedTeams?.length === 0}
            //   onClick={() => exportExcel(sortedTeams)}
            // >
            //   <div className="flex justify-center items-center">
            //     <SiMicrosoftexcel className="mr-2" />
            //     EXPORT
            //   </div>
            // </Button>
            <Button onClick={handlePrint}>
              <div className="flex justify-center items-center">
                <GrPrint className="mr-2" />
                PRINT
              </div>
            </Button>
          )}
        </div>
      </div>
      <div ref={componentRef}>
        {/* Print Header */}
        <div
          className="print-header"
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          <h1>List of Team</h1>
          <p>Barangay: {brgy}</p>
          <p>
            List as of {format(new Date(new Date()), "MMM dd, yyyy  hh:mm a")}
          </p>
        </div>
        <Table columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr">
          <Table.Header>
            <div>Team ID.</div>
            <div>Precinct Leader</div>

            <div>Precint No.</div>
            <div>Total Members</div>
            <div>Barangay</div>
            <div>Created By</div>
            <div>Type</div>
            {/* <div>Status</div> */}
          </Table.Header>
          {isPending ? (
            <Spinner />
          ) : (
            <>
              <Table.Body
                data={sortedTeams}
                render={(teams) => (
                  <TeamRow
                    ValidationSettings={ValidationSettings}
                    teams={teams}
                    key={teams.id}
                    brgy={brgy}
                  />
                )}
              />
              <Table.Footer>
                <Pagination count={count} />
              </Table.Footer>
            </>
          )}
        </Table>
      </div>
    </Menus>
  );
}

export default TeamTable;
