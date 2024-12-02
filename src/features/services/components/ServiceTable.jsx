import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import ServiceRow from "./ServiceRow";
import { useState } from "react";
import Search from "../../../ui/Search";
import Pagination from "../../../ui/Pagination";
import { useFetchAllData, useServices } from "../hooks/useServices";
import { useDebounce } from "use-debounce";
import { download, generateCsv, mkConfig } from "export-to-csv";
import Button from "../../../ui/Button";
import { SiMicrosoftexcel } from "react-icons/si";
import { useEffect } from "react";
import { barangayOptions } from "../../../utils/constants";
import { useSearchParams } from "react-router-dom";
import { insertLogs } from "../../../utils/recordUserActivity";
import { useQueryClient } from "@tanstack/react-query";
import SpinnerMini from "../../../ui/SpinnerMini";

function ServiceTable() {
  const allow_export = true;
  const [fetchAll, setFetchAll] = useState(false);

  useEffect(() => {
    if (allow_export) {
      setFetchAll(true);
    }
  }, [allow_export]);

  const { all_data, isPending: isPending01 } = useFetchAllData(fetchAll);

  const [exceldata, setExceldata] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, services, count } = useServices(debouncedSearchTerm);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  let sortedElectorates = services;
  useEffect(() => {
    const data = all_data?.map((row) => {
      const { id, electorate_id, user_id, ...rest } = row;
      return rest;
    });

    setExceldata(data);
  }, [all_data]);

  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const csvConfig = mkConfig({
    showTitle: true,
    title: `SERVICES RECIPIENTS | BRGY:${brgy} | PAGE:${page}`,
    fieldSeparator: ",",
    filename: `Services_${brgy.toLowerCase()}_p${page}`, // export file name (without .csv)
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);

  const params = {
    page: "Services",
    action: "Exported the Services Data to Excel File",
    parameters: "downloading excel",
    user_id: userData.id,
  };

  const exportExcel = (rows) => {
    const csv = generateCsv(csvConfig)(rows);
    download(csvConfig)(csv);
    insertLogs(params);
  };
  return (
    <Menus>
      {/* <Search onChange={handleSearchChange} /> */}
      <div className="flex-row">
        <div className="w-full ">
          <Search
            width="106rem"
            terms={"Search Name, Assistance Type"}
            onChange={handleSearchChange}
          />
          <Button
            disabled={isPending01 || exceldata?.length === 0}
            onClick={() => exportExcel(exceldata)}
          >
            <div className="flex justify-center items-center">
              <SiMicrosoftexcel className="mr-2" />
              EXPORT
            </div>
          </Button>
        </div>
      </div>
      <Table columns="1fr 3.5fr 1.8fr 2fr 3fr 1.5fr 3.8fr 1.5fr">
        <Table.Header>
          <div>#</div>
          <div>Name</div>
          <div>Barangay</div>
          <div>Purok</div>
          <div>Assistance Type</div>
          <div>Date</div>
          <div>Description</div>
        </Table.Header>
        {isPending ? (
          <Spinner />
        ) : (
          <>
            <Table.Body
              data={sortedElectorates}
              render={(services, index) => (
                <ServiceRow
                  services={services}
                  index={index}
                  key={services.id}
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

export default ServiceTable;
