import Spinner from "../../../../ui/Spinner";
import Table from "../../../../ui/Table";
import Menus from "../../../../ui/Menus";
import { useFetchAllData, useLogs } from "../hooks/useLogs";
import LogsRow from "./LogsRow";
import Search from "../../../../ui/Search";
import { useState } from "react";
import Pagination from "../../../../ui/Pagination";
import { useDebounce } from "use-debounce";
import { download, generateCsv, mkConfig } from "export-to-csv";
import Button from "../../../../ui/Button";
import { SiMicrosoftexcel } from "react-icons/si";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

function LogsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, logs, count } = useLogs(debouncedSearchTerm);

  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const isKalasag = userData.email === "superadmin@gmail.com";
  const allow_export = userData.user_metadata.account_role === "Super Admin";

  const [fetchLogs, setFetchLogs] = useState(false);

  useEffect(() => {
    if (allow_export) {
      setFetchLogs(true);
    }
  }, [allow_export]);

  const { all_logs, isPending: isPending01 } = useFetchAllData(fetchLogs);
  const [exceldata, setExceldata] = useState([]);
  useEffect(() => {
    setExceldata(all_logs);
  }, [all_logs]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  let sortedLogs = logs;
  const csvConfig = mkConfig({
    fieldSeparator: ",",
    filename: "User Logs", // export file name (without .csv)
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const exportExcel = (rows) => {
    const transformedData = rows.map((entry, index) => {
      return {
        "no.": index + 1,
        email: entry.users.email,
        role: entry.users.account_role,
        page: entry.page,
        details: entry.action,
        data: entry.parameters,
        date_time: format(new Date(entry.created_at), "MMM dd yyyy hh:mm:ss a"),
      };
    });
    const rowData = transformedData;
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };
  return (
    <Menus>
      <div className="flex-row">
        <div className="w-full">
          <Search
            width="107rem"
            terms={"Search Page, Details"}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {(allow_export || isKalasag) && (
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
      <div className="mt-6">
        <Table columns="2fr 2fr 1fr 2fr 2fr ">
          <Table.Header>
            {/* <div>#</div> */}
            <div>TIME</div>
            <div>EMAIL</div>
            <div>ROLE</div>
            <div>PAGE</div>
            <div>DETAILS</div>
          </Table.Header>

          {isPending ? (
            <Spinner />
          ) : (
            <>
              <Table.Body
                data={sortedLogs}
                render={(log, index) => (
                  <LogsRow log={log} key={log.id} index={index} />
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

export default LogsTable;
