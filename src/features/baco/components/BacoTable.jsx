import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import {
  // useElectorates,
  useBaco,
} from "../hooks/useBaco";
import BacoRow from "./BacoRow";
import Search from "../../../ui/Search";
import { useState } from "react";
import Pagination from "../../../ui/Pagination";
import { useDebounce } from "use-debounce";
import { download, generateCsv, mkConfig } from "export-to-csv";
import Button from "../../../ui/Button";
import { SiMicrosoftexcel } from "react-icons/si";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../utils/recordUserActivity";

function ElectoratesTable() {
  const [exceldata, setExceldata] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, electorates, count } = useBaco(debouncedSearchTerm);
  console.log("xxxxx", electorates);
  const [searchParams] = useSearchParams();
  // 1) FILTER
  const filterValue = searchParams.get("is_active") || "all";
  let filteredUsers;
  if (filterValue === "all") filteredUsers = electorates;
  if (filterValue === "active")
    filteredUsers = electorates?.filter((user) => user.status === "active");
  if (filterValue === "inactive")
    filteredUsers = electorates?.filter((user) => user.status === "inactive");

  let sortedElectorates = filteredUsers;
  useEffect(() => {
    setExceldata(sortedElectorates);
  }, [sortedElectorates]);
  const csvConfig = mkConfig({
    showTitle: true,
    title: `LIST OF BACO`,
    fieldSeparator: ",",
    filename: `baco`, // export file name (without .csv)
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const allow_export = userData.user_metadata.account_role === "Super Admin";

  const params = {
    page: "Baco",
    action: "Exported the Baco Data to Excel File",
    parameters: "downloading excel",
    user_id: userData.id,
  };

  const exportExcel = (rows) => {
    let rowData = rows.map((item) => {
      const { image, id, electorate_id, ...rest } = item;
      return rest;
    });

    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
    insertLogs(params);
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Menus>
      <div className="flex-row">
        <div className="w-full ">
          <Search
            width="107rem"
            terms={"Search Name"}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {allow_export && (
            <Button
              disabled={exceldata.length === 0}
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

      <Table columns="2.5fr 1fr 1fr 1.8fr 1.8fr 1fr  1fr">
        <Table.Header>
          <div>Name</div>
          <div>Gender</div>
          <div>Contact#</div>
          <div>Brgy</div>
          <div>Created By</div>
          <div>Status</div>
          <div></div>
        </Table.Header>
        {isPending ? (
          <Spinner />
        ) : (
          <>
            <Table.Body
              data={sortedElectorates}
              render={(electorate, index) => (
                <BacoRow
                  searchText={searchTerm}
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
    </Menus>
  );
}

export default ElectoratesTable;
