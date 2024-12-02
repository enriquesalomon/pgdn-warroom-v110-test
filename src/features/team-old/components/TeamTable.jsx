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

function TeamTable() {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
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
      const { members, image, electorate_id, ...rest } = row; // Destructure to remove `members`
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

  return (
    <Menus>
      <div className="flex-row">
        <div className="w-full ">
          <Search
            width="107rem"
            terms={"Search Name, Barangay, Precinct #"}
            onChange={handleSearchChange}
          />
          {allow_export && (
            <Button
              disabled={sortedTeams?.length === 0}
              onClick={() => exportExcel(sortedTeams)}
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
      <Table columns="1fr 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr">
        <Table.Header>
          <div>Team ID.</div>
          <div>Tower</div>
          <div>Precint No.</div>
          <div>Total Members</div>
          <div>Contact No.</div>
          <div>Barangay</div>
          <div>Position</div>
          <div>Status</div>
        </Table.Header>
        {isPending ? (
          <Spinner />
        ) : (
          <>
            <Table.Body
              data={sortedTeams}
              render={(teams) => <TeamRow teams={teams} key={teams.id} />}
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

export default TeamTable;
