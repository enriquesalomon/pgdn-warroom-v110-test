import Spinner from "../../../../ui/Spinner";
import Table from "../../../../ui/Table";
import Menus from "../../../../ui/Menus";
import { useBeneficiary, useFetchAllData } from "../hooks/useServices";
import BeneficiaryRow from "./BeneficiaryRow";
import Search from "../../../../ui/Search";
import { useEffect, useState } from "react";
import Pagination from "../../../../ui/Pagination";
import { useDebounce } from "use-debounce";
import { download, generateCsv, mkConfig } from "export-to-csv";
import Button from "../../../../ui/Button";
import { SiMicrosoftexcel } from "react-icons/si";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../../utils/recordUserActivity";
import { useSearchParams } from "react-router-dom";

function ServicesBeneficiaryTable() {
  const [exceldata, setExceldata] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, electorates, all_availed, count } =
    useBeneficiary(debouncedSearchTerm);
  console.log("xxxx", JSON.stringify(electorates));
  const [searchParams] = useSearchParams();
  const voters_type = searchParams.get("voters_type");
  let filteredData = all_availed;
  if (voters_type === "BACO") {
    filteredData = electorates.filter(
      (item) => item.electorates.isbaco === true
    );
  }
  if (voters_type === "GM") {
    filteredData = electorates.filter(
      (item) => item.electorates.is_gm === true
    );
  }
  if (voters_type === "AGM") {
    filteredData = electorates.filter(
      (item) => item.electorates.is_agm === true
    );
  }
  if (voters_type === "LEGEND") {
    filteredData = electorates.filter(
      (item) => item.electorates.is_legend === true
    );
  }
  if (voters_type === "ELITE") {
    filteredData = electorates.filter(
      (item) => item.electorates.is_elite === true
    );
  }
  if (voters_type === "TOWER") {
    filteredData = electorates.filter(
      (item) => item.electorates.isleader === true
    );
  }
  if (voters_type === "WARRIORS") {
    filteredData = electorates.filter(
      (item) =>
        item.electorates.precinctleader !== null &&
        item.electorates.isleader !== true
    );
  }
  if (voters_type === "NOT_IN_TEAM") {
    filteredData = electorates.filter(
      (item) =>
        item.electorates.precinctleader === null &&
        item.electorates.isleader !== true &&
        item.electorates.isbaco !== true &&
        item.electorates.is_gm !== true &&
        item.electorates.is_agm !== true &&
        item.electorates.is_elite !== true &&
        item.electorates.is_legend !== true
    );
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const allow_export = userData.user_metadata.account_role === "Super Admin";

  const [fetchAll, setFetchAll] = useState(false);

  useEffect(() => {
    if (allow_export) {
      setFetchAll(true);
    }
  }, [allow_export]);

  const { all_data, isPending: isPending01 } = useFetchAllData(fetchAll);

  let sortedElectorates = filteredData;
  useEffect(() => {
    // Create a new array without the user_id property
    const data = all_data?.map((row) => {
      const { id, created_at, electorate_id, user_id, ...rest } = row;
      return rest;
    });

    setExceldata(data);
  }, [all_data]);

  const csvConfig = mkConfig({
    fieldSeparator: ",",
    filename: "Services Beneficiary List", // export file name (without .csv)
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });
  const params = {
    page: "Reports Services Beneficiary",
    action: `Exported the Services Beneficiary Data to Excel File`,
    parameters: `downloading excel`,
    user_id: userData.id,
  };
  const exportExcel = (rows) => {
    const rowData = rows;
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
    insertLogs(params);
  };
  if (isPending) return <Spinner />;
  return (
    <Menus>
      <div className="flex-row">
        <div className="w-full ">
          <Search
            terms={"Search Name"}
            value={searchTerm}
            onChange={handleSearchChange}
            width="107rem"
          />
          {allow_export && (
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
        <Table columns="0.5fr 1fr 1fr 1fr 1fr">
          <Table.Header>
            <div>ID</div>
            <div>NAME</div>
            <div>Title</div>
            <div>BARANGAY</div>
          </Table.Header>

          <Table.Body
            data={sortedElectorates}
            render={(electorate, index) => (
              <BeneficiaryRow
                electorate={electorate}
                all_availed={all_availed}
                key={electorate.id}
                index={index}
              />
            )}
          />
          <Table.Footer>
            <Pagination count={count} />
          </Table.Footer>
        </Table>
      </div>
    </Menus>
  );
}

export default ServicesBeneficiaryTable;
