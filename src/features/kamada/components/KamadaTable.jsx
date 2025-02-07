import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useRef, useState } from "react";
import DebouncedInput from "../../../ui/DebouncedInput";
import { mkConfig, generateCsv, download } from "export-to-csv";
import {
  useKamadaResult,
  useTotal_Count_Summaru_PerBrgy,
} from "../hooks/useElectorates";
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
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { SlPrinter } from "react-icons/sl";
const StyledOption = styled.option`
  /* padding: 1.6rem 2.4rem; */

  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  color: var(--color-grey-600);
`;
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

    /* Apply  border to table headers in the second column */
    th:nth-child(3) {
      border-right: 1px solid #ffc966;
    }
    th:nth-child(6) {
      border-right: 1px solid #ffc966;
    }

    td:nth-child(6) {
      border-right: 1px solid #ffc966;
    }

    th:nth-child(14) {
      border-right: 1px solid #ffc966;
    }

    td:nth-child(14) {
      border-right: 1px solid #ffc966;
    }
    th:nth-last-child(4) {
      background-color: orange;
      color: white; /* Set text color to white for better contrast */
    }

    th:nth-last-child(3) {
      background-color: #90caf9;
      color: white; /* Set text color to white for better contrast */
    }
    th:nth-last-child(2) {
      background-color: #8cc640;
      color: white; /* Set text color to white for better contrast */
    }

    th:last-child {
      background-color: #4a6da7;
      color: white; /* Set text color to white for better contrast */
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
const KamadaTable = ({ isZoom, isHide_search_export }) => {
  const componentRef = useRef();
  const noSelectStyle = {
    userSelect: "none",
  };

  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const allow_export = userData.user_metadata.account_role === "Super Admin";
  const { isPending, kamada_result } = useKamadaResult();
  const { settings: { projected_winning_votes } = {} } = useSettings();
  let electorates;
  if (kamada_result && kamada_result.data) electorates = kamada_result.data;
  const { data: total_count_summary_per_brgy } =
    useTotal_Count_Summaru_PerBrgy();

  kamada_result?.data?.forEach((item) => {
    const matchingBrgy = total_count_summary_per_brgy?.data.find(
      (dataItem) => dataItem.brgy === item.barangay
    );
    if (matchingBrgy) {
      item.baco_count = matchingBrgy.baco_count;
      item.gm_count = matchingBrgy.gm_count;
      item.agm_count = matchingBrgy.agm_count;
      item.legend_count = matchingBrgy.legend_count;
      item.elite_count = matchingBrgy.elite_count;
    }
  });

  console.log("KAMADA datas:", JSON.stringify(kamada_result));

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
          <span>{info.row.original.baco_count}</span>
        </>
      ),
      header: "BACO",
    }),
    columnHelper.accessor("", {
      cell: (info) => (
        <>
          <span>{info.row.original.gm_count}</span>
        </>
      ),
      header: "GM",
    }),

    columnHelper.accessor("", {
      cell: (info) => (
        <>
          <span>{info.row.original.agm_count}</span>
        </>
      ),
      header: "AGM",
    }),

    columnHelper.accessor("", {
      cell: (info) => (
        <>
          <span>{info.row.original.legend_count}</span>
        </>
      ),
      header: "LEGEND",
    }),
    columnHelper.accessor("", {
      cell: (info) => (
        <>
          <span>{info.row.original.elite_count}</span>
        </>
      ),
      header: "ELITE",
    }),
    columnHelper.accessor("", {
      cell: (info) => (
        <>
          <span>{info.row.original.organized_tower}</span>
          {/* <span className="text-base pl-3">
            {`   (${info.row.original.organized_tower_percent.toFixed(2)}%)`}
          </span> */}
          <span className="text-base pl-3">
            {`   (${
              info.row.original.organized_tower_percent &&
              !isNaN(info.row.original.organized_tower_percent)
                ? info.row.original.organized_tower_percent.toFixed(2)
                : "0.00"
            }%)`}
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
      cell: (info) => {
        const {
          total_organized_voters,
          baco_count,
          gm_count,
          agm_count,
          legend_count,
          elite_count,
        } = info.row.original;
        const total_organized_voters_new =
          total_organized_voters +
          baco_count +
          gm_count +
          agm_count +
          legend_count +
          elite_count;
        return (
          <>
            <span>{total_organized_voters_new || 0}</span>
            {/* <span className="text-base pl-3">
            {`   (${info.row.original.voters_percent.toFixed(2)}%)`}
          </span> */}
          </>
        );
      },
      header: "TOTAL ORGANIZED VOTERS",
    }),

    columnHelper.accessor("", {
      cell: (info) => {
        const {
          voters_ato,
          baco_count,
          gm_count,
          agm_count,
          legend_count,
          elite_count,
        } = info.row.original;
        const maxWidthBar = 50; // Maximum width of the bar in units
        const maxValue = info.row.original.voters; // Maximum value to represent (adjust as needed)
        const voters_ato_total_new =
          voters_ato +
          baco_count +
          gm_count +
          agm_count +
          legend_count +
          elite_count;
        // Calculate the width of the bar based on the percentage of voters_ato
        const barWidth = (voters_ato_total_new / maxValue) * maxWidthBar;

        return (
          <>
            <div className="flex items-center">
              <span>{voters_ato_total_new || 0}</span>
              {/* <span
                className="bar-graph"
                style={{
                  display: "inline-block",
                  width: barWidth,
                  height: "10px",
                  backgroundColor: "orange",
                  marginLeft: "5px", // Adjust spacing between text and bar
                }}
              /> */}
            </div>
          </>
        );
      },
      header: "ATO",
    }),

    columnHelper.accessor("", {
      cell: (info) => {
        const { voters_ot } = info.row.original;
        const maxWidthBar = 50; // Maximum width of the bar in units
        const maxValue = info.row.original.voters; // Maximum value to represent (adjust as needed)

        // Calculate the width of the bar based on the percentage of voters_ato
        const barWidth = (voters_ot / maxValue) * maxWidthBar;

        return (
          <>
            <div className="flex items-center">
              <span>{voters_ot || 0}</span>
              {/* <span
                className="bar-graph"
                style={{
                  display: "inline-block",
                  width: barWidth,
                  height: "10px",
                  backgroundColor: "grey",
                  marginLeft: "5px", // Adjust spacing between text and bar
                }}
              /> */}
            </div>
          </>
        );
      },
      header: "OUT OF TOWN",
    }),
    columnHelper.accessor("", {
      cell: (info) => {
        const { voters_inc } = info.row.original;
        const maxWidthBar = 50; // Maximum width of the bar in units
        const maxValue = info.row.original.voters; // Maximum value to represent (adjust as needed)

        // Calculate the width of the bar based on the percentage of voters_ato
        const barWidth = (voters_inc / maxValue) * maxWidthBar;

        return (
          <>
            <div className="flex items-center">
              <span>{voters_inc || 0}</span>
              {/* <span
                className="bar-graph"
                style={{
                  display: "inline-block",
                  width: barWidth,
                  height: "10px",
                  backgroundColor: "grey",
                  marginLeft: "5px", // Adjust spacing between text and bar
                }}
              /> */}
            </div>
          </>
        );
      },
      header: "INC",
    }),
    columnHelper.accessor("", {
      cell: (info) => {
        const { voters_jehovah } = info.row.original;
        const maxWidthBar = 50; // Maximum width of the bar in units
        const maxValue = info.row.original.voters; // Maximum value to represent (adjust as needed)

        // Calculate the width of the bar based on the percentage of voters_ato
        const barWidth = (voters_jehovah / maxValue) * maxWidthBar;

        return (
          <>
            <div className="flex items-center">
              <span>{voters_jehovah || 0}</span>
              <span
                className="bar-graph"
                // style={{
                //   display: "inline-block",
                //   width: barWidth,
                //   height: "10px",
                //   backgroundColor: "grey",
                //   marginLeft: "5px", // Adjust spacing between text and bar
                // }}
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

  const params = {
    page: "Kamada",
    action: "Exported the Kamada Data to Excel File",
    parameters: "downloading excel",
    user_id: userData.id,
  };

  const csvConfig = mkConfig({
    showTitle: true,
    title: `KAMADA`,
    fieldSeparator: ",",
    filename: `KAMADA`,
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

    const transformedData = rowData.map((entry, index) => {
      return {
        brangay: entry.barangay,
        total_voters: entry.voters,
        projected_winning_votes: entry.projected_winning_votes,
        projected_tower: entry.projected_tower,
        projected_members: entry.projected_members,
        baco_count: entry.baco_count,
        gm_count: entry.gm_count,
        agm_count: entry.agm_count,
        legend_count: entry.legend_count,
        elite_count: entry.elite_count,
        organized_tower: entry.organized_tower,
        organized_warriors: entry.organized_member,
        total_organized_voters:
          entry.total_organized_voters +
          entry.baco_count +
          entry.gm_count +
          entry.agm_count +
          entry.legend_count +
          entry.elite_count,
        voters_ato:
          entry.total_organized_voters +
          entry.baco_count +
          entry.gm_count +
          entry.agm_count +
          entry.legend_count +
          entry.elite_count,
        voters_ot: entry.voters_ot,
        voters_inc: entry.voters_inc,
        voters_jehovah: entry.voters_jehovah,
      };
    });

    const csv = generateCsv(csvConfig)(transformedData);
    download(csvConfig)(csv);
    insertLogs(params);
  };

  if (isPending) return <Spinner />;
  return (
    <>
      {isHide_search_export && (
        <ReactToPrint
          trigger={() => (
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
            >
              Print
            </button>
          )}
          content={() => componentRef.current}
        />
      )}

      <StyledBox barWidth={100} ref={componentRef}>
        <div>
          <div className="flex justify-between">
            <Row type="horizontal" className="mb-2">
              <Heading as="h2">Kamada Table</Heading>
            </Row>

            {!isZoom && (
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
                    <KamadaTable isZoom={true} />
                  </Modal.Window>
                </Modal>
              </div>
            )}
          </div>
          <div className="flex justify-between mb-2">
            {!isHide_search_export && (
              <div className="w-full flex items-center gap-1 mr-2">
                <DebouncedInput
                  value={globalFilter ?? ""}
                  onChange={(value) => setGlobalFilter(String(value))}
                  className="w-full  p-2 bg-transparent border duration-30 border-gray-500 border-opacity-10 rounded-md  "
                  placeholder="Search"
                />
              </div>
            )}

            {allow_export && !isHide_search_export && (
              <Button
                onClick={() => exportExcel(table.getFilteredRowModel().rows)}
              >
                <div className="flex justify-center items-center">
                  <SiMicrosoftexcel className="mr-2" />
                  EXPORT
                </div>
              </Button>
            )}
            {!isHide_search_export && (
              <Modal>
                <Modal.Open opens="service-form">
                  <Button className="ml-2">
                    <div className="flex justify-center items-center">
                      <SlPrinter className="mr-2" />
                      PRINT
                    </div>
                  </Button>
                </Modal.Open>
                <Modal.Window
                  backdrop={true}
                  name="service-form"
                  heightvar="100%"
                  widthvar="100%"
                >
                  <KamadaTable isZoom={true} isHide_search_export={true} />
                </Modal.Window>
              </Modal>
            )}
          </div>
          <div
            className="border duration-300 border-gray-500 border-opacity-10  rounded-lg"
            // ref={tableRef}
          >
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
                    <tr key={row.id}>
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
                <StyledOption key={pageSize} value={pageSize}>
                  Show {pageSize}
                </StyledOption>
              ))}
            </select>
          </div>
        </div>
      </StyledBox>
    </>
  );
};

export default KamadaTable;
