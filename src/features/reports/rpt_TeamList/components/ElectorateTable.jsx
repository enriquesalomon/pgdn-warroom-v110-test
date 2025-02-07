import Spinner from "../../../../ui/Spinner";
import Menus from "../../../../ui/Menus";
import Button from "../../../../ui/Button";
import {
  useBrgyPrecincts,
  useElectorate,
  useFetchAllData,
  useFirstSelectData,
} from "../hooks/useElectorates";
import { useRef, useState } from "react";
import Pagination from "../../../../ui/Pagination";
import { useDebounce } from "use-debounce";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  barangayOptions,
  PAGE_SIZE_bygroup,
} from "../../../../utils/constants";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { GrPrint } from "react-icons/gr";
import { format } from "date-fns";
import { useValidationSettings_Running } from "../../../team-validation/hooks/useValitionSettings";
const mapping = {
  "*": "18-30",
  A: "Illiterate",
  B: "PWD",
  C: "Senior Citizen",
};
function ElectorateTable() {
  const componentRef = useRef(); // Ref to the component to print
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);

  const isKalasag = userData.email === "superadmin@gmail.com";
  const allow_export = userData.user_metadata.account_role === "Super Admin";
  const { isPending2, validation_settings = {} } =
    useValidationSettings_Running();
  let validation_name;
  if (validation_settings.length > 0) {
    validation_name = validation_settings[0].validation_name;
  }
  const { data: firstData, isLoading: firstLoading } = useFirstSelectData();
  const [fetchElectorates, setFetchElectorates] = useState(false);
  useEffect(() => {
    if (allow_export) {
      setFetchElectorates(true);
    }
  }, [allow_export]);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, electorates, count } = useElectorate(debouncedSearchTerm);
  const { isPending: isPending1, all_precincts } = useBrgyPrecincts();
  console.log("all_precincts", JSON.stringify(all_precincts));

  const groupBy = (array, key) =>
    array.reduce((result, item) => {
      (result[item[key]] = result[item[key]] || []).push(item);
      return result;
    }, {});

  const groupedData = groupBy(electorates, "precinctleader");
  console.log("groupedData", JSON.stringify(groupedData));

  // Pagination logic
  const [searchParams, setSearchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;

  // Print handler using react-to-print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current, // The ref to the component you want to print
    documentTitle: "Electorates Data", // Optional document title for the printed file
  });
  function getClusterNumberByPrecinct(data, precinct) {
    if (!Array.isArray(data)) {
      console.warn("Invalid data passed to getClusterNumberByPrecinct:", data);
      return null;
    }

    const entry = data.find((item) => item.precinct === precinct);
    return entry ? entry.cluster_number : null; // Return null if not found
  }

  const matchCluster = (precinctno) => {
    const match = all_precincts?.data.find(
      (item) => item.precinct === precinctno
    );
    return match ? match.cluster_number : "Not Found";
  };

  if (isPending) return <Spinner />;
  return (
    <>
      <Menus>
        <div className="flex-row">
          <div className="w-full">
            {(allow_export || isKalasag) && (
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
            <p>{brgy} LIST OF TEAM</p>
            <p>
              Masterlist as of{" "}
              {format(new Date(new Date()), "MMM dd, yyyy  hh:mm a")}
            </p>
          </div>

          <div>
            {Object.keys(groupedData).map((leader) => {
              // Retrieve the first row in the group to access the leader's details
              const leaderData = groupedData[leader]?.find(
                (row) => row.isleader
              );

              return (
                <div key={leader} className="mb-8">
                  <hr className="mb-4" />
                  <h2>
                    LEADER:{" "}
                    {leaderData?.lastname +
                      ", " +
                      leaderData?.firstname +
                      " " +
                      leaderData?.middlename ||
                      "" + " " + leaderData?.name_ext ||
                      ""}
                  </h2>
                  {/* <h2>
                    CLUSTER NO:{". "}
                    {getClusterNumberByPrecinct(
                      firstData,
                      leaderData?.precinctno
                    )}
                  </h2> */}
                  {/* <h2>PUROK: {leaderData?.purok || ""}</h2> */}
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
                            textAlign: "left",
                            width: "10%",
                          }}
                        >
                          No.
                        </th>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "left",
                            width: "15%",
                          }}
                        >
                          Cluster
                        </th>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "left",
                            width: "15%",
                          }}
                        >
                          Precinct No.
                        </th>

                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "left",
                            width: "25%",
                          }}
                        >
                          Members
                        </th>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "left",
                            width: "20%",
                          }}
                        >
                          Remarks
                        </th>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "left",
                            width: "30%", // Larger width for the signature column
                          }}
                        >
                          Signature
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedData[leader]
                        .filter((row) => !row.isleader)
                        .map((row, index) => (
                          <tr key={row.id}>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                                textAlign: "left",
                                width: "10%",
                              }}
                            >
                              {index + 1}
                            </td>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                                textAlign: "left",
                                width: "15%",
                              }}
                            >
                              {matchCluster(row.precinctno)}
                            </td>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                                textAlign: "left",
                                width: "15%",
                              }}
                            >
                              {row.precinctno}
                            </td>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                                textAlign: "left",
                                width: "25%",
                                color:
                                  validation_name &&
                                  ((row.firstvalidation_tag === "OUT OF TOWN" &&
                                    validation_name === "1st Validation") ||
                                    (row.secondvalidation_tag ===
                                      "OUT OF TOWN" &&
                                      validation_name === "2nd Validation") ||
                                    (row.thirdvalidation_tag ===
                                      "OUT OF TOWN" &&
                                      validation_name === "3rd Validation"))
                                    ? "#FB9EC6" // Apply this color if "OUT OF TOWN" matches
                                    : "inherit", // Default color
                              }}
                            >
                              {row.lastname}, {row.firstname} {row.middlename}{" "}
                              {row.name_ext}
                            </td>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                                textAlign: "left",
                                width: "20%",
                              }}
                            >
                              {row.rmks
                                ? [...row.rmks]
                                    .filter((char) => mapping[char]) // Only include characters that exist in the mapping
                                    .map((char) => mapping[char]) // Map to the equivalent meaning
                                    .join(", ") // Join the mapped values with a comma
                                : ""}
                            </td>
                            {/* <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "left",
                              width: "20%",
                            }}
                          >
                            {[
                              row.remarks_18_30 && "18-30",
                              row.remarks_pwd && "PWD",
                              row.remarks_illiterate && "Illiterate",
                              row.remarks_senior_citizen && "Senior Citizen",
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </td> */}
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                                textAlign: "left",
                                width: "30%",
                              }}
                            ></td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>

          {/* Pagination Component */}
          {/* <Pagination count={count} set_pagesize={PAGE_SIZE_bygroup} /> */}
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
