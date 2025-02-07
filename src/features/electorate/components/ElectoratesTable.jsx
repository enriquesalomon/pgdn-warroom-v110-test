import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import {
  useAllElectoratesPer_Brgy,
  useFetchAllData,
} from "../hooks/useElectorates";
import ElectoratesRow from "./ElectoratesRow";
import Search from "../../../ui/Search";
import { useRef, useState } from "react";
import Pagination from "../../../ui/Pagination";
import { useDebounce } from "use-debounce";
import { download, generateCsv, mkConfig } from "export-to-csv";
import Button from "../../../ui/Button";
import { SiMicrosoftexcel } from "react-icons/si";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { barangayOptions } from "../../../utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../utils/recordUserActivity";
import { useReactToPrint } from "react-to-print";
import { GrPrint } from "react-icons/gr";
import { format } from "date-fns";
function ElectoratesTable() {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const isKalasag = userData.email === "superadmin@gmail.com";
  const allow_export = userData.user_metadata.account_role === "Super Admin";

  const [fetchElectorates, setFetchElectorates] = useState(false);
  const componentRef = useRef(); // Ref to the component to print

  useEffect(() => {
    if (allow_export) {
      setFetchElectorates(true);
    }
  }, [allow_export]);

  const { electorates_all, isPending: isPending01 } = useFetchAllData();

  const [exceldata, setExceldata] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, electorates, count } =
    useAllElectoratesPer_Brgy(debouncedSearchTerm);

  let sortedElectorates = electorates;
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  useEffect(() => {
    setExceldata(electorates_all);
  }, [sortedElectorates, electorates_all]);
  const csvConfig = mkConfig({
    showTitle: true,
    title: `LIST OF ELECTORATES | BRGY:${brgy}`,
    fieldSeparator: ",",
    filename: `electorates_${brgy.toLowerCase()}`, // export file name (without .csv)
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const params = {
    page: "Electorates",
    action: "Exported the Electorates Data to Excel File",
    parameters: "downloading excel",
    user_id: userData.id,
  };

  const exportExcel = (rows) => {
    let rowData = rows.map((item) => {
      const { image, id, ...rest } = item;
      return rest;
    });

    //assigning null value into zero 0
    rowData.forEach((item) => {
      for (let key in item) {
        if (item[key] === null) {
          item[key] = "";
        }
      }
    });

    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
    insertLogs(params);
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
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
            terms={"Search Name, Sector"}
            value={searchTerm}
            onChange={handleSearchChange}
          />

          {(allow_export || isKalasag) && (
            <>
              <Button
                disabled={isPending01 || exceldata?.length === 0}
                onClick={() => exportExcel(exceldata)}
                className="mr-2 mt-2"
              >
                <div className="flex justify-center items-center">
                  <SiMicrosoftexcel className="mr-2" />
                  EXPORT ALL
                </div>
              </Button>
              <Button onClick={handlePrint}>
                <div className="flex justify-center items-center">
                  <GrPrint className="mr-2" />
                  PRINT
                </div>
              </Button>
            </>
          )}
        </div>
      </div>
      <div ref={componentRef}>
        {/* Print Header */}
        <div
          className="print-header"
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          <h1>Electorates List</h1>
          <p>Barangay: {brgy}</p>
          <p>
            List as of {format(new Date(new Date()), "MMM dd, yyyy  hh:mm a")}
          </p>
        </div>

        {/* Wrap the component you want to print in the ref */}
        <Table columns="1fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1fr">
          <Table.Header>
            {/* <div></div> */}
            {/* Add no-print class to the column header */}
            <div>ID</div>
            <div>Precinct No.</div>
            <div>Lastname</div>
            <div>Firstname</div>
            <div>Middlename</div>
            <div>Suffix</div>
            <div>Remarks</div>
            <div>Purok</div>
            <div>Brgy</div>
            <div>Municipality</div>
            <div className="no-print"></div>
          </Table.Header>
          {isPending ? (
            <Spinner />
          ) : (
            <>
              <Table.Body
                data={sortedElectorates}
                render={(electorate, index) => (
                  <ElectoratesRow
                    searchTerm={searchTerm}
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

export default ElectoratesTable;
