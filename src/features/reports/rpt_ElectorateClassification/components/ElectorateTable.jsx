import Spinner from "../../../../ui/Spinner";
import Menus from "../../../../ui/Menus";
import Button from "../../../../ui/Button";
import { useElectorate, useFetchAllData } from "../hooks/useElectorates";
import Search from "../../../../ui/Search";
import { useState } from "react";
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

function ElectorateTable() {
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
  // console.log("ang electorates", JSON.stringify(electorates));
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

  let tag;
  switch (filterValue) {
    case "1":
      tag = "ATO";
      break;
    case "0":
      tag = "UV";
      break;
    case "4":
      tag = "OT";
      break;
    case "5":
      tag = "INC";
      break;
    case "6":
      tag = "JHV";
      break;
    default:
      tag = "";
      break;
  }

  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  // const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const csvConfig = mkConfig({
    showTitle: true,
    title: `ELECTORATE CLASSIFICATION BRGY:${brgy}`,
    fieldSeparator: ",",
    filename: `electorate_classification_${tag}_${brgy.toLowerCase()}`, // export file name (without .csv)
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
        id: entry.id,
        firstname: entry.firstname,
        middlename: entry.middlename,
        lastname: entry.lastname,
        purok: entry.purok,
        brgy: entry.brgy,
        baco: entry.team ? `${entry.team.baco_name}` : "none",
        gm: entry.team ? `${entry.team.gm_name} ` : "none",
        agm: entry.team ? `${entry.team.agm_name}` : "none",
        legend: entry.team ? `${entry.team.legend_name}` : "none",
        elite: entry.team ? `${entry.team.elite_name}` : "none",
        tower: entry.team
          ? `${entry.team.firstname} ${entry.team.lastname}`
          : "none",
        remarks_validated:
          filterValue === "1"
            ? "ATO"
            : filterValue === "0"
            ? "none"
            : entry.voters_type,
      };
    });
    const rowData = transformedData;
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
    insertLogs(params);
  };

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
            <Button
              disabled={isPending01 || exceldata?.length === 0}
              onClick={() => exportExcel(exceldata)}
            >
              <div className="flex justify-center items-center">
                <SiMicrosoftexcel className="mr-2" />
                EXPORT
              </div>
            </Button>
          )}
        </div>
      </div>
      <div className="mt-4">
        {/* <Table columns="1fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1fr"> */}
        <Table columns="0.5fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr">
          <Table.Header>
            <div>#</div>
            <div>Precinct No.</div>
            <div>Lastname</div>
            <div>Firstname</div>
            <div>Middlename</div>
            <div>Purok</div>
            <div>Brgy</div>
            <div>Baco</div>
            <div>GM</div>
            <div>AGM</div>
            <div>Legend</div>
            <div>Elite</div>
            <div>Tower</div>
          </Table.Header>
          {isPending ? (
            <Spinner />
          ) : (
            <>
              <Table.Body
                data={sortedElectorates}
                render={(electorate, index) => (
                  <TableRow
                    page={page}
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
