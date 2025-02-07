import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import { useAllElectoratesPer_Brgy } from "../hooks/useElectorates";
import ElectoratesRow from "./ElectoratesRow";
import { useRef } from "react";
import Pagination from "../../../ui/Pagination";
import Button from "../../../ui/Button";

import { useSearchParams } from "react-router-dom";
import { barangayOptions } from "../../../utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import { useReactToPrint } from "react-to-print";
import { GrPrint } from "react-icons/gr";
function ElectoratesTable() {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  console.log("username", JSON.stringify(userData.email));
  const isKalasag = userData.email === "superadmin@gmail.com";
  const allow_print = userData.user_metadata.account_role === "Super Admin";
  const componentRef = useRef(); // Ref to the component to print

  const { isPending, electorates, count } = useAllElectoratesPer_Brgy();

  let sortedElectorates = electorates;
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const precinct = searchParams.get("precinctBy") || "";

  // Print handler using react-to-print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current, // The ref to the component you want to print
    documentTitle: "Electorates Data", // Optional document title for the printed file
  });

  return (
    <Menus>
      <div className="flex-row">
        <div className="w-full ">
          {(allow_print || isKalasag) && (
            <>
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
          <h1>SURVEY FORM</h1>
          <p>Barangay: {brgy}</p>
          <p>Precinct No.: {precinct}</p>
        </div>

        {/* Wrap the component you want to print in the ref */}
        <Table columns="1fr 1.5fr 1.5fr 1.5fr 1.5fr 1fr 1.4fr 4.4fr">
          <Table.Header>
            {/* <div></div> */}
            {/* Add no-print class to the column header */}
            <div>ID</div>
            <div>Precinct No.</div>
            <div>Lastname</div>
            <div>Firstname</div>
            <div>Middlename</div>
            <div>Suffix</div>
            <div>Purok</div>
            <div>Survey Remarks</div>
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

export default ElectoratesTable;
