import Spinner from "../../../../ui/Spinner";
import Table from "../../../../ui/Table";
import Menus from "../../../../ui/Menus";
import { useElectorateFilter, useFetchAllData } from "../hooks/useElectorates";
import ElectoratesRow from "./ElectoratesRow";
import Search from "../../../../ui/Search";
import { useRef, useState } from "react";
import Pagination from "../../../../ui/Pagination";
import { useDebounce } from "use-debounce";
import { download, generateCsv, mkConfig } from "export-to-csv";
import Button from "../../../../ui/Button";
import { SiMicrosoftexcel } from "react-icons/si";
import {
  barangayOptions,
  resultMapping,
  validationMapping,
} from "../../../../utils/constants";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../../utils/recordUserActivity";
import { GrPrint } from "react-icons/gr";
import { useReactToPrint } from "react-to-print";
import { format } from "date-fns";
import { useEffect } from "react";

function ElectorateValidatedTable() {
  const componentRef = useRef(); // Ref to the component to print

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, electorates, count } =
    useElectorateFilter(debouncedSearchTerm);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);

  const isKalasag = userData.email === "superadmin@gmail.com";
  const allow_export = userData.user_metadata.account_role === "Super Admin";

  let sortedElectorates = electorates;
  const { electorates_all, isPending: isPending01 } = useFetchAllData();
  const [exceldata, setExceldata] = useState([]);
  useEffect(() => {
    setExceldata(electorates_all);
    console.log("excel ni nga data", JSON.stringify(exceldata));
  }, [sortedElectorates, electorates_all, exceldata]);

  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  let filter_result = searchParams.get("filterby");

  const csvConfig = mkConfig({
    showTitle: true,
    title: `GOLD AFFILIATES LIST`,
    fieldSeparator: ",",
    filename: `gold affiliates list`,
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const params = {
    page: "Gold Affiliates Report",
    action: "Exported Data to Excel File",
    parameters: "downloading excel",
    user_id: userData.id,
  };

  const exportExcel = (rows) => {
    let rowData = rows.map((item) => {
      const { ...rest } = item;
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
            value={searchTerm}
            onChange={handleSearchChange}
            width="107rem"
          />
          {(allow_export || isKalasag) && (
            <>
              <Button
                disabled={isPending01 || exceldata?.length === 0}
                onClick={() => exportExcel(exceldata)}
                className="mr-2"
              >
                <div className="flex justify-center items-center">
                  <SiMicrosoftexcel className="mr-2" />
                  EXPORT
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
      <div className="mt-6" ref={componentRef}>
        {/* <Table columns="1fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1fr"> */}
        {/* Print Header */}
        <div
          className="print-header"
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          <h1>Electorates Affiliate List</h1>
          <p>Barangay: {brgy}</p>
          <p>Filter by: {filter_result || "ALL"}</p>
          <p>
            List as of {format(new Date(new Date()), "MMM dd, yyyy  hh:mm a")}
          </p>
          {/* <p>Validation: {new Date().toLocaleDateString()}</p> */}
        </div>

        <Table columns="0.6fr 2.4fr 2.4fr 2.4fr 2.4fr 2.4fr 2.4fr 2.4fr">
          <Table.Header>
            <div>#</div>
            <div>Precinct#</div>
            <div>LAST NAME</div>
            <div>FIRST NAME</div>
            <div>MIDDLE NAME</div>
            <div>PUROK</div>
            <div>BARANGAY</div>
            <div>TYPE</div>
          </Table.Header>

          {isPending ? (
            <Spinner />
          ) : (
            <>
              <Table.Body
                data={sortedElectorates}
                render={(electorate, index) => (
                  <ElectoratesRow
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

export default ElectorateValidatedTable;
