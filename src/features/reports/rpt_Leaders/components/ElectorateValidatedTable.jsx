import Spinner from "../../../../ui/Spinner";
import Table from "../../../../ui/Table";
import Menus from "../../../../ui/Menus";
import { useElectorateFilter } from "../hooks/useElectorates";
import ElectoratesRow from "./ElectoratesRow";
import Search from "../../../../ui/Search";
import { useRef, useState } from "react";
import Pagination from "../../../../ui/Pagination";
import { useDebounce } from "use-debounce";
import Button from "../../../../ui/Button";
import { barangayOptions } from "../../../../utils/constants";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { GrPrint } from "react-icons/gr";
import { useReactToPrint } from "react-to-print";
import { format } from "date-fns";

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

  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const filter_result = searchParams.get("filterby") || "ALL";

  let filterby = searchParams.get("filterby");

  const params = {
    page: "Electorate Validated",
    action: "Exported the Validated Electorates Data to Excel File",
    parameters: "downloading excel",
    user_id: userData.id,
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
            // <Button
            //   disabled={sortedElectorates.length === 0}
            //   onClick={() => exportExcel(sortedElectorates)}
            // >
            //   <div className="flex justify-center items-center">
            //     <SiMicrosoftexcel className="mr-2" />
            //     EXPORT
            //   </div>
            // </Button>
            <Button onClick={handlePrint}>
              <div className="flex justify-center items-center">
                <GrPrint className="mr-2" />
                PRINT
              </div>
            </Button>
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
          <h1>Leaders List</h1>
          <p>Barangay: {brgy}</p>
          <p>Filter by: {filter_result}</p>
          <p>
            List as of {format(new Date(new Date()), "MMM dd, yyyy  hh:mm a")}
          </p>
          {/* <p>Validation: {new Date().toLocaleDateString()}</p> */}
        </div>

        <Table columns="0.6fr 2.4fr 2.4fr 2.4fr 2.4fr 1.4fr 2.4fr 2.4fr 2.4fr">
          <Table.Header>
            <div>#</div>
            <div>Precinct#</div>
            <div>LAST NAME</div>
            <div>FIRST NAME</div>
            <div>MIDDLE NAME</div>
            <div>Suffix</div>
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
