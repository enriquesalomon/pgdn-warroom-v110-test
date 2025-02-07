import Spinner from "../../../../ui/Spinner";
import Menus from "../../../../ui/Menus";
import Button from "../../../../ui/Button";
import { useElectorate, useFetchAllData } from "../hooks/useElectorates";
import Search from "../../../../ui/Search";
import { useRef, useState } from "react";
import Pagination from "../../../../ui/Pagination";
import { useDebounce } from "use-debounce";
import { SiMicrosoftexcel } from "react-icons/si";
import { download, generateCsv, mkConfig } from "export-to-csv";
import TableRow from "./TableRow";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../../utils/recordUserActivity";
import Table from "../../../../ui/Table";
import { useEffect } from "react";
import { barangayOptions } from "../../../../utils/constants";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { GrPrint } from "react-icons/gr";

function ElectorateTable() {
  const componentRef = useRef(); // Ref to the component to print

  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const allow_export = userData.user_metadata.account_role === "Super Admin";

  const [fetchElectorates, setFetchElectorates] = useState(false);
  useEffect(() => {
    if (allow_export) {
      setFetchElectorates(true);
    }
  }, [allow_export]);

  const { electorates_all, isPending: isPending01 } =
    useFetchAllData(fetchElectorates);
  const [exceldata, setExceldata] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, electorates, count } = useElectorate(debouncedSearchTerm);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  let sortedElectorates = electorates;

  useEffect(() => {
    setExceldata(electorates_all);
  }, [sortedElectorates, electorates_all]);

  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const filterValue = searchParams.get("assigned") || "1";

  // const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const csvConfig = mkConfig({
    showTitle: true,
    title: `LIST OF TEAM BRGY:${brgy}`,
    fieldSeparator: ",",
    filename: `list_team_${brgy.toLowerCase()}`, // export file name (without .csv)
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const params = {
    page: "Reports Team List",
    action: "Exported the list of team to Excel File",
    parameters: "downloading excel",
    user_id: userData.id,
  };

  const exportExcel = (rows) => {
    const transformedData = rows.map((entry, index) => {
      return {
        "no.": index + 1,
        team_id: entry.id,
        baco: entry.baco_name,
        gm: entry.gm_name,
        agm: entry.agm_name,
        legend: entry.legend_name,
        elite: entry.elite_name,
        tower: entry.firstname + " " + entry.lastname,
        barangay: entry.barangay,
        total_members: JSON.parse(entry.members).length,
        members_name: entry.members_name
          .map((member) => member.label)
          .join(", "),
      };
    });
    const rowData = transformedData;
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
    insertLogs(params);
  };
  // Print handler using react-to-print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current, // The ref to the component you want to print
    documentTitle: "Electorates Data", // Optional document title for the printed file
  });

  // if (isPending) return <Spinner />;
  return (
    <Menus>
      <div className="flex-row">
        <div className="w-full">
          <Search
            terms={"Search Name, Precinct #"}
            value={searchTerm}
            onChange={handleSearchChange}
            width="107rem"
          />
          {allow_export && (
            // <Button
            //   disabled={isPending01 || exceldata?.length === 0}
            //   onClick={() => exportExcel(exceldata)}
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
      <div className="mt-4" ref={componentRef}>
        {/* Print Header */}
        <div
          className="print-header"
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          <h1>List of Leaders</h1>
          <p>Barangay: {brgy}</p>
          {/* <p>Validation: {new Date().toLocaleDateString()}</p> */}
        </div>
        {/* <Table columns="1fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1fr"> */}
        <Table columns="0.5fr 1.8fr 1.8fr 1.8fr 0.8fr">
          <Table.Header>
            <div>#</div>
            <div>Leader</div>
            <div>Barangay</div>
            <div>Total Members</div>
          </Table.Header>
          {isPending ? (
            <Spinner />
          ) : (
            <>
              <Table.Body
                data={sortedElectorates}
                render={(electorate, index) => (
                  <TableRow
                    scannedvoters={true}
                    electorate={electorate}
                    key={electorate.id}
                    index={index}
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

export default ElectorateTable;
