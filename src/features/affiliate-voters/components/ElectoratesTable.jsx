import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import Button from "../../../ui/Button";
import { useElectoratesAto } from "../hooks/useElectoratesAto";

import ElectoratesRow from "./ElectoratesRow";
import Search from "../../../ui/Search";
import { useState } from "react";
import Pagination from "../../../ui/Pagination";
import { useDebounce } from "use-debounce";
import { SiMicrosoftexcel } from "react-icons/si";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { barangayOptions } from "../../../utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../utils/recordUserActivity";

function ElectoratesTable() {
  const [exceldataElectorates, setExceldataElectorates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, electorates, count } =
    useElectoratesAto(debouncedSearchTerm);

  console.log("voters ato---", JSON.stringify(electorates));
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const allow_export = userData.user_metadata.account_role === "Super Admin";

  let sortedElectorates = electorates;

  useEffect(() => {
    // const data = sortedElectorates?.map((entry) => {
    //   const { precinctno, lastname, firstname, middlename, purok, brgy } =
    //     entry.electorates;
    //   return { precinctno, lastname, firstname, middlename, purok, brgy };
    // });
    setExceldataElectorates(sortedElectorates);
  }, [sortedElectorates]);

  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const csvConfig = mkConfig({
    showTitle: true,
    title: `ORGANIZED VOTERS(ATO) | BRGY:${brgy} | PAGE:${page}`,
    fieldSeparator: ",",
    filename: `Voters(ato)_${brgy.toLowerCase()}_p${page}`, // export file name (without .csv)
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const params = {
    page: "Organized Voters",
    action: "Exported the Organized Voters (ATO) Data to Excel File",
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
        <div className="w-full ">
          <Search
            terms={"Search Name"}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {/* {allow_export && (
            <Button
              disabled={exceldataElectorates.length === 0}
              onClick={() => exportExcel(exceldataElectorates)}
            >
              <div className="flex justify-center items-center">
                <SiMicrosoftexcel className="mr-2" />
                EXPORT
              </div>
            </Button>
          )} */}
        </div>
      </div>

      <Table columns="1fr 1.8fr 1.8fr 1.8fr 1.8fr 1fr 1.8fr 1.8fr 1.8fr 1.8fr 1fr">
        <Table.Header>
          <div>#</div>
          <div>Precinct No.</div>
          <div>Lastname</div>
          <div>Firstname</div>
          <div>Middlename</div>
          <div>Suffix</div>
          <div>Purok</div>
          <div>Brgy</div>
          <div>TYPE</div>
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
                  electorate={electorate}
                  key={electorate.id}
                  index={index}

                  // onSelectElectorate={(onSelectElectorate, close)}
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
