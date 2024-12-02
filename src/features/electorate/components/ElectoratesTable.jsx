import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import {
  useAllElectoratesPer_Brgy,
  useFetchAllData,
} from "../hooks/useElectorates";
import ElectoratesRow from "./ElectoratesRow";
import Search from "../../../ui/Search";
import { useState } from "react";
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
import SpinnerMini from "../../../ui/SpinnerMini";

function ElectoratesTable() {
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
  const { isPending, electorates, count } =
    useAllElectoratesPer_Brgy(debouncedSearchTerm);
  // if (!electorates.length) return <Empty resourceName="electorates" />;
  // 2) SORT
  // const sortBy = searchParams.get("sortBy") || "name-desc";

  // let sortedElectorates = [...filteredElectorates].sort((a, b) => {
  //   if (sortBy === "name-asc") {
  //     return a.lastname.localeCompare(b.lastname);
  //   } else {
  //     return b.lastname.localeCompare(a.lastname);
  //   }
  // });

  let sortedElectorates = electorates;
  // let sortedElectorates = filteredElectorates.filter(
  //   (item) =>
  //     item.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.middlename.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.precinctno.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.purok?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.brgy?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

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

          {allow_export && (
            <Button
              disabled={isPending01 || exceldata?.length === 0}
              onClick={() => exportExcel(exceldata)}
            >
              <div className="flex justify-center items-center">
                {/* <SiMicrosoftexcel className="mr-2" /> */}
                <SiMicrosoftexcel className="mr-2" />
                EXPORT
              </div>
            </Button>
          )}
        </div>
      </div>

      <Table columns="0.5fr 1fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr  1fr">
        <Table.Header>
          <div></div>
          <div>ID</div>
          <div>Precinct No.</div>
          <div>Lastname</div>
          <div>Firstname</div>
          <div>Middlename</div>
          <div>Purok</div>
          <div>Brgy</div>
          <div>City</div>
          <div></div>
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
    </Menus>
  );
}

export default ElectoratesTable;
