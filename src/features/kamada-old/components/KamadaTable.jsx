import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import DebouncedInput from "../../../ui/DebouncedInput";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { useKamadaResult } from "../hooks/useElectorates";
import Spinner from "../../../ui/Spinner";
import { useSettings } from "../../settings/hooks/useSettings";
import DashboardBox from "../../voters-monitoring/components/DashboardBox";
import styled from "styled-components";
import Row from "../../../ui/Row";
import Heading from "../../../ui/Heading";
import Modal from "../../../ui/Modal";
import ButtonIcon from "../../../ui/ButtonIcon";
import { MdOpenInFull } from "react-icons/md";
import Button from "../../../ui/Button";
import { SiMicrosoftexcel } from "react-icons/si";
import { useSearchParams } from "react-router-dom";
import { validationMapping } from "../../../utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../utils/recordUserActivity";
const StyledBox = styled(DashboardBox)`
  grid-column: 1 / -1;

  .table-container {
    width: 100%;
    border-collapse: collapse;

    /* Styling for table cells */
    td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    /* Apply red border to cells in the second column */
    th:nth-child(1) {
      padding-left: 26px;
    }
    td:nth-child(1) {
      padding-left: 26px;
    }
    /* td:nth-child(2) {
      padding-right: 16px;
    } */
    th:nth-child(3) {
      padding-left: 30px;
    }
    td:nth-child(3) {
      padding-left: 30px;
    }
    td:nth-child(3) {
      border-right: 1px solid #ffc966;
    }

    /* Apply red border to table headers in the second column */
    th:nth-child(3) {
      border-right: 1px solid #ffc966;
    }
    th:nth-child(7) {
      border-right: 1px solid #ffc966;
    }

    td:nth-child(7) {
      border-right: 1px solid #ffc966;
    }

    th:nth-child(9) {
      border-right: 1px solid #ffc966;
    }

    td:nth-child(9) {
      border-right: 1px solid #ffc966;
    }
    th:nth-last-child(7) {
      background-color: orange;
      color: white; /* Set text color to white for better contrast */
    }
    th:nth-last-child(6) {
      background-color: red;
      color: white; /* Set text color to white for better contrast */
    }
    th:nth-last-child(5) {
      background-color: grey;
      color: white; /* Set text color to white for better contrast */
    }
    th:nth-last-child(4) {
      background-color: black;
      color: white; /* Set text color to white for better contrast */
    }
    th:nth-last-child(3) {
      background-color: #f4efef;
      color: black; /* Set text color to white for better contrast */
    }
    th:nth-last-child(2) {
      background-color: #f4efef;
      color: black; /* Set text color to white for better contrast */
    }

    th:last-child {
      background-color: #f4efef;
      color: black; /* Set text color to white for better contrast */
    }

    /* Apply custom styling to the ATO column */
    td[data-column="voters_ato"] {
      position: relative;
    }

    td[data-column="voters_ato"]::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: ${(props) =>
        props.barWidth}%; /* Dynamically set the width based on the column value */
      background-color: orange; /* Set the bar color to orange */
      z-index: -1; /* Place the bar behind the cell content */
    }
  }
`;
const KamadaTable = () => {
  const noSelectStyle = {
    userSelect: "none",
  };

  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const allow_export = userData.user_metadata.account_role === "Super Admin";
  const { isPending, kamada_result } = useKamadaResult();
  const { settings: { projected_turnout, projected_winning_votes } = {} } =
    useSettings();
  let electorates;
  if (kamada_result && kamada_result.data) electorates = kamada_result.data;

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("", {
      cell: (info) => <span>{info.row.index + 1}</span>,
      header: "#",
    }),
    columnHelper.accessor("barangay", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "BARANGAY",
    }),
    columnHelper.accessor("voters", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "TOTAL VOTERS",
    }),

    // columnHelper.accessor("projected_turnout", {
    //   cell: (info) => <span>{info.getValue()}</span>,

    //   header: "PROJECTED TURNOUT (" + projected_turnout + "%)",
    // }),
    columnHelper.accessor("projected_winning_votes", {
      cell: (info) => <span>{info.getValue()}</span>,

      header: "PROJECTED WINNING VOTES (" + projected_winning_votes + "%)",
    }),
    columnHelper.accessor("projected_tower", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "PROJECTED TOWER",
    }),
    columnHelper.accessor("projected_members", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "PROJECTED MEMBERS",
    }),

    columnHelper.accessor("", {
      cell: (info) => (
        <>
          <span>{info.row.original.organized_tower}</span>
          <span className="text-base pl-3">
            {`   (${info.row.original.organized_tower_percent.toFixed(2)}%)`}
          </span>
        </>
      ),
      header: "ORGANIZED TOWER",
    }),

    columnHelper.accessor("", {
      cell: (info) => (
        <>
          <span>{info.row.original.organized_member}</span>
          <span className="text-base pl-3">
            {`(${info.row.original.member_percent.toFixed(2)}%)`}
          </span>
        </>
      ),
      header: "ORGANIZED MEMBER",
    }),

    columnHelper.accessor("", {
      cell: (info) => (
        <>
          <span>{info.row.original.total_organized_voters}</span>
          <span className="text-base pl-3">
            {`   (${info.row.original.voters_percent.toFixed(2)}%)`}
          </span>
        </>
      ),
      header: "TOTAL ORGANIZED VOTERS",
    }),

    columnHelper.accessor("", {
      cell: (info) => {
        const { voters_ato } = info.row.original;
        const maxWidthBar = 50; // Maximum width of the bar in units
        const maxValue = info.row.original.voters; // Maximum value to represent (adjust as needed)

        // Calculate the width of the bar based on the percentage of voters_ato
        const barWidth = (voters_ato / maxValue) * maxWidthBar;

        return (
          <>
            <div className="flex items-center">
              <span>{voters_ato || 0}</span>
              <span
                className="bar-graph"
                style={{
                  display: "inline-block",
                  width: barWidth,
                  height: "10px",
                  backgroundColor: "orange",
                  marginLeft: "5px", // Adjust spacing between text and bar
                }}
              />
            </div>
          </>
        );
      },
      header: "ATO",
    }),

    columnHelper.accessor("", {
      cell: (info) => {
        const { voters_dili } = info.row.original;
        const maxWidthBar = 50; // Maximum width of the bar in units
        const maxValue = info.row.original.voters; // Maximum value to represent (adjust as needed)

        // Calculate the width of the bar based on the percentage of voters_ato
        const barWidth = (voters_dili / maxValue) * maxWidthBar;

        return (
          <>
            <div className="flex items-center">
              <span>{voters_dili || 0}</span>
              <span
                className="bar-graph flex"
                style={{
                  display: "inline-block",
                  width: barWidth,
                  height: "10px",
                  backgroundColor: "red",
                  marginLeft: "5px", // Adjust spacing between text and bar
                }}
              />
            </div>
          </>
        );
      },
      header: "DILI",
    }),

    columnHelper.accessor("", {
      cell: (info) => {
        const { voters_undecided } = info.row.original;
        const maxWidthBar = 50; // Maximum width of the bar in units
        const maxValue = info.row.original.voters; // Maximum value to represent (adjust as needed)

        // Calculate the width of the bar based on the percentage of voters_ato
        const barWidth = (voters_undecided / maxValue) * maxWidthBar;

        return (
          <>
            <div className="flex items-center">
              <span>{voters_undecided || 0}</span>
              <span
                className="bar-graph"
                style={{
                  display: "inline-block",
                  width: barWidth,
                  height: "10px",
                  backgroundColor: "grey",
                  marginLeft: "5px", // Adjust spacing between text and bar
                }}
              />
            </div>
          </>
        );
      },
      header: "UNDECIDED",
    }),
    columnHelper.accessor("", {
      cell: (info) => {
        const { voters_deceased } = info.row.original;
        const maxWidthBar = 50; // Maximum width of the bar in units
        const maxValue = info.row.original.voters; // Maximum value to represent (adjust as needed)

        // Calculate the width of the bar based on the percentage of voters_ato
        const barWidth = (voters_deceased / maxValue) * maxWidthBar;

        return (
          <>
            <div className="flex items-center">
              <span>{voters_deceased || 0}</span>
              <span
                className="bar-graph"
                style={{
                  display: "inline-block",
                  width: barWidth,
                  height: "10px",
                  backgroundColor: "grey",
                  marginLeft: "5px", // Adjust spacing between text and bar
                }}
              />
            </div>
          </>
        );
      },
      header: "DECEASED",
    }),
    columnHelper.accessor("", {
      cell: (info) => {
        const { voters_deceased } = info.row.original;
        const maxWidthBar = 50; // Maximum width of the bar in units
        const maxValue = info.row.original.voters; // Maximum value to represent (adjust as needed)

        // Calculate the width of the bar based on the percentage of voters_ato
        const barWidth = (voters_deceased / maxValue) * maxWidthBar;

        return (
          <>
            <div className="flex items-center">
              <span>{0}</span>
              <span
                className="bar-graph"
                style={{
                  display: "inline-block",
                  width: barWidth,
                  height: "10px",
                  backgroundColor: "grey",
                  marginLeft: "5px", // Adjust spacing between text and bar
                }}
              />
            </div>
          </>
        );
      },
      header: "OUT OF TOWN",
    }),
    columnHelper.accessor("", {
      cell: (info) => {
        const { voters_deceased } = info.row.original;
        const maxWidthBar = 50; // Maximum width of the bar in units
        const maxValue = info.row.original.voters; // Maximum value to represent (adjust as needed)

        // Calculate the width of the bar based on the percentage of voters_ato
        const barWidth = (voters_deceased / maxValue) * maxWidthBar;

        return (
          <>
            <div className="flex items-center">
              <span>{0}</span>
              <span
                className="bar-graph"
                style={{
                  display: "inline-block",
                  width: barWidth,
                  height: "10px",
                  backgroundColor: "grey",
                  marginLeft: "5px", // Adjust spacing between text and bar
                }}
              />
            </div>
          </>
        );
      },
      header: "INC",
    }),
    columnHelper.accessor("", {
      cell: (info) => {
        const { voters_deceased } = info.row.original;
        const maxWidthBar = 50; // Maximum width of the bar in units
        const maxValue = info.row.original.voters; // Maximum value to represent (adjust as needed)

        // Calculate the width of the bar based on the percentage of voters_ato
        const barWidth = (voters_deceased / maxValue) * maxWidthBar;

        return (
          <>
            <div className="flex items-center">
              <span>{0}</span>
              <span
                className="bar-graph"
                style={{
                  display: "inline-block",
                  width: barWidth,
                  height: "10px",
                  backgroundColor: "grey",
                  marginLeft: "5px", // Adjust spacing between text and bar
                }}
              />
            </div>
          </>
        );
      },
      header: "JEHOVAH",
    }),
  ];
  const data = useMemo(() => electorates ?? [], [electorates]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // export function
  // Note: change _ in Row<_>[] with your Typescript type.

  const [searchParams] = useSearchParams();
  let validationType = searchParams.get("validation");
  validationType = validationMapping[validationType] || "first_validation";
  validationType =
    validationType === "third_validation"
      ? "3rd Validation"
      : validationType === "second_validation"
      ? "2nd Validation"
      : "1st Validation";

  const params = {
    page: "Kamada",
    action: "Exported the Kamada Data to Excel File",
    parameters: "downloading excel",
    user_id: userData.id,
  };

  const csvConfig = mkConfig({
    showTitle: true,
    title: `KAMADA | ${validationType}`,
    fieldSeparator: ",",
    filename: `KAMADA_${validationType}`,
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });
  const exportExcel = (rows) => {
    let rowData = rows.map((row) => row.original);

    //assigning null value into zero 0
    rowData.forEach((item) => {
      for (let key in item) {
        if (item[key] === null) {
          item[key] = 0;
        }
      }
    });

    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
    insertLogs(params);
  };

  if (isPending) return <Spinner />;
  // if (isPending) return <Spinner />;
  return (
    // <div className="p-2 max-w-5xl mx-auto text-white fill-gray-400">
    <StyledBox barWidth={100}>
      <div>
        <div className="flex justify-between">
          <Row type="horizontal">
            <Heading as="h2">Kamada Table</Heading>
            <span className="ml-7">{validationType}</span>
          </Row>

          <div className="mb-8">
            <Modal>
              <Modal.Open opens="service-form">
                <ButtonIcon>
                  <MdOpenInFull className="mr-2" />
                </ButtonIcon>
              </Modal.Open>
              <Modal.Window
                backdrop={true}
                name="service-form"
                heightvar="100%"
                widthvar="100%"
              >
                <KamadaTable />
              </Modal.Window>
            </Modal>
          </div>
        </div>
        <div className="flex justify-between mb-2">
          <div className="w-full flex items-center gap-1 mr-2">
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              className="w-full  p-2 bg-transparent border duration-30 border-gray-500 border-opacity-10 rounded-md  "
              placeholder="Search"
            />
          </div>
          {allow_export && (
            <Button
              onClick={() => exportExcel(table.getFilteredRowModel().rows)}
            >
              <div className="flex justify-center items-center">
                <SiMicrosoftexcel className="mr-2" />
                EXPORT
              </div>
            </Button>
          )}
        </div>
        <div className="border duration-300 border-gray-500 border-opacity-10  rounded-lg">
          <table
            className="w-full text-left table-container "
            style={{
              borderCollapse: "collapse",
              margin: 0,
              padding: 0,
              width: "100%",
              tableLayout: "fixed",
            }}
          >
            <thead className="">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="capitalize text-base pl-2 pt-2 border-b border-gray-500 border-solid border-opacity-10"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody style={noSelectStyle}>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, i) => (
                  <tr
                    key={row.id}

                    // className={`
                    // ${i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                    // `}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className=" p-6 py-4 border-b border-gray-500 border-solid border-opacity-10 text-xl"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr className="text-center h-32">
                  <td colSpan={12}>No Record Found!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* pagination */}
        <div className="flex items-center justify-end mt-6 gap-2">
          <button
            onClick={() => {
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
            className="p-1 border border-gray-300 px-2 disabled:opacity-30"
          >
            {"<"}
          </button>
          <button
            onClick={() => {
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
            className="p-1 border border-gray-300 px-2 disabled:opacity-30"
          >
            {">"}
          </button>

          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-16 bg-transparent"
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="p-2 bg-transparent"
          >
            {[10, 20, 30, 50, 60].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </StyledBox>
  );
};

export default KamadaTable;
