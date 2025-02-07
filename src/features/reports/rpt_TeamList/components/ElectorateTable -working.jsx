import Spinner from "../../../../ui/Spinner";
import Menus from "../../../../ui/Menus";
import Button from "../../../../ui/Button";
import { useElectorate, useFetchAllData } from "../hooks/useElectorates";
import Search from "../../../../ui/Search";
import { useRef, useState } from "react";
import Pagination from "../../../../ui/Pagination";
import { useDebounce } from "use-debounce";
import { SiMicrosoftexcel } from "react-icons/si";
import { download, generateCsv, mkConfig } from "export-to-csv";
import TableRow from "./TableRow";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../../utils/recordUserActivity";
import Table from "../../../../ui/Table";
import { useEffect } from "react";
import {
  barangayOptions,
  PAGE_SIZE_bygroup,
} from "../../../../utils/constants";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { GrPrint } from "react-icons/gr";
import { format } from "date-fns";

function ElectorateTable() {
  const componentRef = useRef(); // Ref to the component to print
  const [groupedElectorates, setGroupedElectorates] = useState({});
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const allow_export = userData.user_metadata.account_role === "Super Admin";

  const [fetchElectorates, setFetchElectorates] = useState(false);
  useEffect(() => {
    if (allow_export) {
      setFetchElectorates(true);
    }
  }, [allow_export]);

  // const { electorates_all, isPending: isPending01 } =
  //   useFetchAllData(fetchElectorates);
  // const [exceldata, setExceldata] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, electorates, count } = useElectorate(debouncedSearchTerm);

  // Pagination logic
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const filterValue = searchParams.get("assigned") || "1";
  const pageSize = 10; // You can adjust this value or make it dynamic

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  // let sortedElectorates = electorates;

  // useEffect(() => {
  //   setExceldata(electorates_all);
  // }, [sortedElectorates, electorates_all]);

  useEffect(() => {
    if (electorates && electorates.length > 0) {
      console.log("e group", electorates);
      setGroupedElectorates({});
      // Group data by "id" and include processed `members_name`
      const grouped = electorates.reduce((result, current) => {
        const {
          id,
          members_name,
          firstname,
          lastname,
          precinctno,
          barangay,
          purok,
          clustered_precinct,
        } = current;

        // Ensure each ID has a group
        if (!result[id]) {
          result[id] = {
            id,
            members: [],
            firstname,
            lastname,
            precinctno,
            barangay,
            purok,
            clustered_precinct,
          };
        }

        // Add `members_name` to the group's `members` as an array of labels
        const memberLabels = members_name.map((member) => member.label);

        result[id].members.push(...memberLabels);

        return result;
      }, {});

      setGroupedElectorates(grouped);
    }
  }, [electorates, brgy]);

  // Print handler using react-to-print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current, // The ref to the component you want to print
    documentTitle: "Electorates Data", // Optional document title for the printed file
  });

  if (isPending) return <Spinner />;
  return (
    <>
      <Menus>
        <div className="flex-row">
          <div className="w-full">
            <Search
              terms={"Search Name, Precinct #"}
              value={searchTerm}
              onChange={handleSearchChange}
              width="107rem"
            />
            {allow_export && (
              <Button onClick={handlePrint}>
                <div className="flex justify-center items-center">
                  <GrPrint className="mr-2" />
                  PRINT
                </div>
              </Button>
            )}
          </div>
        </div>
        <div className="mt-4 p-12" ref={componentRef}>
          <div
            className="print-header"
            style={{ textAlign: "center", marginBottom: "20px" }}
          >
            {/* Header for the Group */}
            <p>{brgy} LIST</p>
            <p>
              Masterlist as of{" "}
              {format(new Date(new Date()), "MMM dd, yyyy  hh:mm a")}
            </p>
          </div>
          {/* Iterate through each group and render a table */}
          {count >= 1 ? (
            Object.entries(groupedElectorates).map(([id, group], index) => (
              <div key={index} className="mb-8">
                <hr className="mb-4" />
                <p>
                  LEADER: {group.lastname}, {group.firstname}
                </p>
                <p>
                  CLUSTERED/GROUPED PRECINCT:{" "}
                  {(() => {
                    try {
                      const precinctArray = JSON.parse(
                        group.clustered_precinct
                      );
                      return Array.isArray(precinctArray)
                        ? precinctArray.join(", ")
                        : "";
                    } catch (e) {
                      return ""; // Handle invalid JSON strings
                    }
                  })()}
                </p>
                <p>PUROK: {group.purok}</p>
                {/* Table */}
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: "20px",
                    fontSize: "14px",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#f4f4f4" }}>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        No.
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        Members Name
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Signature
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.members.map((member, idx) => (
                      <tr key={idx}>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          {idx + 1}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          {member} {/* Member name */}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        ></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <div>No data available for the selected filter.</div>
          )}

          {/* Pagination Component */}
          <Pagination count={count} set_pagesize={PAGE_SIZE_bygroup} />
        </div>
      </Menus>
    </>
  );
}

export default ElectorateTable;

export function groupBy(array, key) {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    return result;
  }, {});
}
