import Spinner from "../../../../ui/Spinner";
import Table from "../../../../ui/Table";
import Menus from "../../../../ui/Menus";
import {
  useElectorateValidated,
  useFetchAllData,
} from "../hooks/useElectorates";
import ElectoratesRow from "./ElectoratesRow";
import Search from "../../../../ui/Search";
import { useEffect, useRef, useState } from "react";
import Pagination from "../../../../ui/Pagination";
import { useDebounce } from "use-debounce";
import { download, generateCsv, mkConfig } from "export-to-csv";
import Button from "../../../../ui/Button";
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
import { SiMicrosoftexcel } from "react-icons/si";

function ElectorateValidatedTable() {
  const componentRef = useRef(); // Ref to the component to print

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, electorates, count } =
    useElectorateValidated(debouncedSearchTerm);
  const { electorates_all, isPending: isPending01 } = useFetchAllData();
  const [exceldata, setExceldata] = useState([]);
  useEffect(() => {
    setExceldata(electorates_all);
  }, [electorates_all]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);

  const isKalasag = userData.email === "superadmin@gmail.com";
  const allow_export = userData.user_metadata.account_role === "Super Admin";

  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const filter_result = searchParams.get("result") || "ALL";

  let validationType = searchParams.get("validation");
  validationType = validationMapping[validationType] || "first_validation";
  validationType =
    validationType === "third_validation"
      ? "3rd Validation"
      : validationType === "second_validation"
      ? "2nd Validation"
      : "1st Validation";

  const csvConfig = mkConfig({
    showTitle: true,
    title: `NON-TEAM VALIDATION REPORT | ${validationType}`,
    fieldSeparator: ",",
    filename: `nonteam validation report`,
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const params = {
    page: "Electorate Validated",
    action: "Exported the Validated Electorates Data to Excel File",
    parameters: "downloading excel",
    user_id: userData.id,
  };
  const exportExcel = (rows) => {
    console.log("execl data", JSON.stringify(validationType));

    const finalData = rows.map((item) => {
      const {
        firstvalidation_tag,
        secondvalidation_tag,
        thirdvalidation_tag,
        id,
        ...rest
      } = item;

      if (validationType === "1st Validation") {
        // Remove secondvalidation_tag and thirdvalidation_tag
        return { ...rest, firstvalidation_tag };
      } else if (validationType === "2nd Validation") {
        // Remove firstvalidation_tag and thirdvalidation_tag
        return { ...rest, secondvalidation_tag };
      } else if (validationType === "3rd Validation") {
        // Remove firstvalidation_tag and thirdvalidation_tag
        return { ...rest, thirdvalidation_tag };
      }

      // Default: return the object unchanged if valData doesn't match
      return item;
    });

    // // Removing the unwanted fields
    // const finalData = rows.map(
    //   ({ id, validation_id, total_count, ...rest }) => rest
    // );

    const csv = generateCsv(csvConfig)(finalData);
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
          <h1>NON-TEAM ELECTORATES CLASSIFICATION LIST</h1>
          <p>{validationType} Round</p>
          <p>{brgy} LIST</p>
          <p>Filter by: {filter_result}</p>
          <p>
            List as of {format(new Date(new Date()), "MMM dd, yyyy  hh:mm a")}
          </p>{" "}
        </div>

        <Table columns="0.6fr 2fr 2.4fr 2.4fr 2.4fr 2.4fr 2.4fr 2.4fr">
          <Table.Header>
            <div>#</div>
            <div>Precinct#</div>
            <div>LAST NAME</div>
            <div>FIRST NAME</div>
            <div>MIDDLE NAME</div>
            <div>PUROK</div>
            <div>BARANGAY</div>
            <div>RESULT</div>
          </Table.Header>

          {isPending ? (
            <Spinner />
          ) : (
            <>
              <Table.Body
                data={electorates}
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
