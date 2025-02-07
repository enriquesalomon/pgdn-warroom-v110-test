import Spinner from "../../../../ui/Spinner";
import Table from "../../../../ui/Table";
import Menus from "../../../../ui/Menus";
import { useElectorateValidated } from "../hooks/useElectorates";
import ElectoratesRow from "./ElectoratesRow";
import Search from "../../../../ui/Search";
import { useState } from "react";
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

function ElectorateValidatedTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, electorates, count } =
    useElectorateValidated(debouncedSearchTerm);

  // let sortedElectorates = [...filteredElectorates].sort((a, b) => {
  //   if (sortBy === "name-asc") {
  //     return a.lastname.localeCompare(b.lastname);
  //   } else {
  //     return b.lastname.localeCompare(a.lastname);
  //   }
  // });
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const allow_export = userData.user_metadata.account_role === "Super Admin";

  let sortedElectorates = electorates;

  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

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
    title: `ELECTORATE VALIDATED | ${validationType}  | PAGE:${page}`,
    fieldSeparator: ",",
    filename: `electorates validated_p${page}`,
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
    const transformedData = rows.map((entry, index) => {
      return {
        "no.": index + 1,
        precinctno: entry.precinctno,
        firstname: entry.firstname,
        middlename: entry.middlename,
        lastname: entry.lastname,
        purok: entry.purok,
        brgy: entry.brgy,
        leader_firstname: entry.leader_firstname,
        leader_lastname: entry.leader_lastname,
        validation_name: entry.validation_name,
        result: resultMapping[entry.result],
      };
    });
    const rowData = transformedData;
    const csv = generateCsv(csvConfig)(rowData);
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
          {allow_export && (
            <Button
              disabled={sortedElectorates.length === 0}
              onClick={() => exportExcel(sortedElectorates)}
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
        <Table columns="0.6fr 2fr 2.4fr 2.4fr 2.4fr 2.4fr 2.4fr 2.4fr 2.4fr 2.4fr">
          <Table.Header>
            <div>#</div>
            <div>Validation</div>
            <div>Precinct#</div>
            <div>FIRST NAME</div>
            <div>MIDDLE NAME</div>
            <div>LAST NAME</div>
            <div>PUROK</div>
            <div>BARANGAY</div>
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
