import Spinner from "../../../../ui/Spinner";
import Table from "../../../../ui/Table";
import Menus from "../../../../ui/Menus";
import { useElectorateValidated } from "../hooks/useElectorates";
import ElectoratesRow from "./ElectoratesRow";
import Search from "../../../../ui/Search";
import { useEffect, useRef, useState } from "react";
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

function ElectorateValidatedTable() {
  const componentRef = useRef(); // Ref to the component to print

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, electorates, count } =
    useElectorateValidated(debouncedSearchTerm);

  const [exceldata, setExceldata] = useState([]);

  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const isKalasag = userData.email === "superadmin@gmail.com";
  const allow_print = userData.user_metadata.account_role === "Super Admin";

  console.log("this is data list", JSON.stringify(electorates));
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  // const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const assigned = searchParams.get("assigned") || "all";
  let sortedElectorates;
  // Filter by result value (e.g., result === 4)
  let filter_result;
  if (assigned === "1") {
    sortedElectorates = electorates.filter((item) => item.result === 1);
    filter_result = "Ato";
  } else if (assigned === "4") {
    sortedElectorates = electorates.filter((item) => item.result === 4);
    filter_result = "Out of Town";
  } else {
    sortedElectorates = electorates;
    filter_result = "ALL";
  }

  let validationType = searchParams.get("validation");
  validationType = validationMapping[validationType] || "first_validation";
  validationType =
    validationType === "third_validation"
      ? "3rd Validation"
      : validationType === "second_validation"
      ? "2nd Validation"
      : "1st Validation";

  // Print handler using react-to-print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current, // The ref to the component you want to print
    documentTitle: "Electorates Data", // Optional document title for the printed file
  });

  useEffect(() => {
    setExceldata(electorates);
  }, [sortedElectorates, electorates]);
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const csvConfig = mkConfig({
    showTitle: true,
    title: `TEAM VALIDATION REPORT | ${validationType}`,
    fieldSeparator: ",",
    filename: `team vallidation report`,
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const params = {
    page: "Team Validation Report",
    action: "Exported Data to Excel File",
    parameters: "downloading excel",
    user_id: userData.id,
  };

  const exportExcel = (rows) => {
    console.log("data to excel", JSON.stringify(rows));

    const modifiedData_result = rows.map(({ result, ...rest }) => ({
      ...rest,
      result: result === 1 ? "ATO" : result === 4 ? "OUT OF TOWN" : result,
    }));

    // Removing the unwanted fields
    const finalData = modifiedData_result.map(
      ({ id, validation_id, total_count, ...rest }) => rest
    );

    //assigning null value into zero 0
    finalData.forEach((item) => {
      for (let key in item) {
        if (item[key] === null) {
          item[key] = "";
        }
      }
    });

    const csv = generateCsv(csvConfig)(finalData);
    download(csvConfig)(csv);
    insertLogs(params);
  };
  return (
    <Menus>
      <div className="flex-row">
        <div className="w-full ">
          <Search
            value={searchTerm}
            onChange={handleSearchChange}
            width="107rem"
          />
          {(allow_print || isKalasag) && (
            <>
              <Button
                disabled={isPending || exceldata?.length === 0}
                onClick={() => exportExcel(exceldata)}
                className="mr-2"
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
      <div className="mt-6" ref={componentRef}>
        {/* <Table columns="1fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1fr"> */}
        {/* Print Header */}
        <div
          className="print-header"
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          <h1>TEAM ELECTORATES CLASSIFICATION LIST</h1>
          <p>{validationType} Round</p>
          <p>Barangay: {brgy}</p>
          <p>Filter by: {filter_result || "All"}</p>
          <p>
            List as of {format(new Date(new Date()), "MMM dd, yyyy  hh:mm a")}
          </p>

          {/* <p>Validation: {new Date().toLocaleDateString()}</p> */}
        </div>

        <Table columns="0.6fr 2fr 2.4fr 2.4fr 2.4fr 2.4fr 2.4fr 2.4fr 2.4fr 2.4fr 2.4fr">
          <Table.Header>
            <div>#</div>
            <div>Validation</div>
            <div>Precinct#</div>
            <div>LAST NAME</div>
            <div>FIRST NAME</div>
            <div>MIDDLE NAME</div>
            <div>PUROK</div>
            <div>BARANGAY</div>
            <div>LUBAS TYPE</div>
            <div>LEADER</div>
            <div>RESULT</div>
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
