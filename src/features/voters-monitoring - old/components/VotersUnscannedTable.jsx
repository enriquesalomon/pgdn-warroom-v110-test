import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import Button from "../../../ui/Button";
import { useUnscannedAto } from "../hooks/useElectoratesAto";
// ../hooks/useElectorates

import Search from "../../../ui/Search";
import { useState } from "react";
import Pagination from "../../../ui/Pagination";
import { useDebounce } from "use-debounce";
import { SiMicrosoftexcel } from "react-icons/si";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { useEffect } from "react";
import UnscannedTableRow from "./UnscannedTableRow";
import Heading from "../../../ui/Heading";
import Row from "../../../ui/Row";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../utils/recordUserActivity";
import { barangayOptions } from "../../../utils/constants";
import { useSearchParams } from "react-router-dom";
import BarangayFilterAll from "../../../ui/BarangayFilterAll";

function VotersUnscannedTable() {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const allow_export = userData.user_metadata.account_role === "Super Admin";
  const [exceldata, setExceldata] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, electorates, count } =
    useUnscannedAto(debouncedSearchTerm);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  let sortedElectorates = electorates;
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const csvConfig = mkConfig({
    showTitle: true,
    title: `UNSCANNED VOTERS LIST BRGY:${brgy} PAGE:${page}`,
    fieldSeparator: ",",
    filename: `unscanned_voters_${brgy.toLowerCase()}_p${page}`, // export file name (without .csv)
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  useEffect(() => {
    // Create a new array without the user_id property
    const data = sortedElectorates.map((row) => {
      const { total_count, ...rest } = row;
      return rest;
    });

    setExceldata(data);
  }, [sortedElectorates]);

  const params = {
    page: "Voters Monitoring",
    action: "Exported the Unscanned Voters Data to Excel File",
    parameters: "downloading excel",
    user_id: userData.id,
  };
  const exportExcel = (rows) => {
    const rowData = rows;
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
    insertLogs(params);
  };

  // if (isPending) return <Spinner />;
  return (
    <Menus>
      <div className="flex-row">
        <Row className="mb-10 mt-10" type="horizontal">
          <Heading as="h2">Unscanned Voters</Heading>
          <BarangayFilterAll />
        </Row>

        <div className="w-full">
          <Search value={searchTerm} onChange={handleSearchChange} />
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
      <div className="mt-4">
        <Table columns="0.5fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr">
          <Table.Header>
            <div>#</div>
            <div>Precinct No.</div>
            <div>Lastname</div>
            <div>Firstname</div>
            <div>Middlename</div>
            <div>Purok</div>
            <div>Brgy</div>
            <div>Leader</div>
          </Table.Header>
          {isPending ? (
            <Spinner />
          ) : (
            <>
              <Table.Body
                data={sortedElectorates}
                render={(electorate, index) => (
                  <UnscannedTableRow
                    electorate={electorate}
                    key={electorate.id || index}
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

export default VotersUnscannedTable;
