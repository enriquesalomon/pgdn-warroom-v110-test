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
  useCount_LP_LM_LDC_W,
  useKamadaResult,
  useNotTeamTagResult,
  useSurveyResult,
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
import { format } from "date-fns";
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
      border-right: 1px solid #145a32;
    }

    /* Apply  border to table headers in the second column */
    th:nth-child(3) {
      border-right: 1px solid #145a32;
    }
    th:nth-child(6) {
      border-right: 1px solid #145a32;
    }

    td:nth-child(6) {
      border-right: 1px solid #145a32;
    }

    th:nth-child(9) {
      border-right: 1px solid #145a32;
    }

    td:nth-child(9) {
      border-right: 1px solid #145a32;
    }
    th:nth-last-child(9) {
      background-color: #145a32;
      color: white; /* Set text color to white for better contrast */
    }

    th:nth-last-child(8) {
      background-color: #ff0000;
      color: white; /* Set text color to white for better contrast */
    }

    th:nth-last-child(7) {
      background-color: #fb9ec6;
      color: white; /* Set text color to white for better contrast */
    }

    th:nth-last-child(6) {
      background-color: #00ff9c;
      color: white; /* Set text color to white for better contrast */
    }

    th:nth-last-child(5) {
      background-color: #f3f4f6;
      color: black; /* Set text color to white for better contrast */
    }

    th:nth-last-child(4) {
      background-color: #0a0a0a;
      color: white; /* Set text color to white for better contrast */
    }

    th:nth-last-child(3) {
      background-color: #fef9c3;
      color: black; /* Set text color to white for better contrast */
    }
    th:nth-last-child(2) {
      background-color: #ffc966;
      color: black; /* Set text color to white for better contrast */
    }

    th:last-child {
      background-color: #e8b903;
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
const KamadaTable = ({ isZoom, isHide_search_export, validationType }) => {
  const componentRef = useRef();
  const noSelectStyle = {
    userSelect: "none",
  };

  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const allow_export = userData.user_metadata.account_role === "Super Admin";
  const { isPending, kamada_result } = useKamadaResult();
  const { isPending: isPending1, survey_result } = useSurveyResult();
  const { isPending: isPending3, count_LP_LM_LDC_W } = useCount_LP_LM_LDC_W();
  const { isPending: isPending2, not_team_result } = useNotTeamTagResult();
  //------------------------this is pending, need to merge the not_team_result into the kamda result
  const { settings: { projected_winning_votes } = {} } = useSettings();
  let electorates;
  // if (kamada_result && kamada_result.data) electorates = kamada_result.data;
  const { data: total_count_summary_per_brgy } =
    useTotal_Count_Summaru_PerBrgy();
  kamada_result?.data.forEach((item) => {
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

  //MERGING TWO DATA SURVEY AND VALIDATION

  const mergeDataforSurvey_and_WithTeam = (
    survey_result,
    count_LP_LM_LDC_W,
    kamada_result
  ) => {
    const merged = {};

    // Add all entries from data1
    survey_result?.data.forEach((item) => {
      merged[item.barangay] = { ...item };
    });

    // Merge entries from affiliates
    count_LP_LM_LDC_W?.data.forEach((item) => {
      if (!merged[item.barangay]) {
        merged[item.barangay] = {};
      }
      merged[item.barangay] = { ...merged[item.barangay], ...item };
    });

    // Merge entries from data2
    kamada_result?.data.forEach((item) => {
      if (!merged[item.barangay]) {
        merged[item.barangay] = {};
      }
      merged[item.barangay] = { ...merged[item.barangay], ...item };
    });

    // Fill in missing properties with 0
    const allKeys = new Set();
    Object.values(merged).forEach((item) => {
      Object.keys(item).forEach((key) => allKeys.add(key));
    });

    Object.values(merged).forEach((item) => {
      allKeys.forEach((key) => {
        if (!(key in item)) {
          item[key] = 0;
        }
      });
    });

    console.log("kamada merge,", JSON.stringify(kamada_result));

    return Object.values(merged);
  };

  const mergeDataforNotTeam_and_WithTeam = (
    not_team_result,
    count_LP_LM_LDC_W,
    kamada_result
  ) => {
    const merged = {};

    // Add all entries from data1
    not_team_result?.data.forEach((item) => {
      merged[item.barangay] = { ...item };
    });

    // Merge entries from affiliates
    count_LP_LM_LDC_W?.data.forEach((item) => {
      if (!merged[item.barangay]) {
        merged[item.barangay] = {};
      }
      merged[item.barangay] = { ...merged[item.barangay], ...item };
    });

    // Merge entries from data2
    kamada_result?.data.forEach((item) => {
      if (!merged[item.barangay]) {
        merged[item.barangay] = {};
      }
      merged[item.barangay] = { ...merged[item.barangay], ...item };
    });

    // Fill in missing properties with 0
    const allKeys = new Set();
    Object.values(merged).forEach((item) => {
      Object.keys(item).forEach((key) => allKeys.add(key));
    });

    Object.values(merged).forEach((item) => {
      allKeys.forEach((key) => {
        if (!(key in item)) {
          item[key] = 0;
        }
      });
    });

    return Object.values(merged);
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("", {
      cell: (info) => <span>{info.row.index + 1}</span>,
      header: "#",
      footer: () => "Total:",
    }),
    columnHelper.accessor("barangay", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "BARANGAY",
      footer: () => "",
    }),
    columnHelper.accessor("voters", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "TOTAL VOTERS",
      footer: (info) =>
        info.table
          .getFilteredRowModel()
          .rows.reduce((sum, row) => sum + row.original.voters, 0),
    }),

    columnHelper.accessor("projected_winning_votes", {
      cell: (info) => <span>{info.getValue()}</span>,

      header: "PROJECTED WINNING VOTES (" + projected_winning_votes + "%)",
      footer: (info) =>
        info.table
          .getFilteredRowModel()
          .rows.reduce(
            (sum, row) => sum + row.original.projected_winning_votes,
            0
          ),
    }),

    columnHelper.accessor("projected_tower", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "PROJECTED SILDA LEADER",
      footer: (info) =>
        info.table
          .getFilteredRowModel()
          .rows.reduce((sum, row) => sum + row.original.projected_tower, 0),
    }),
    columnHelper.accessor("projected_members", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "PROJECTED MEMBERS",
      footer: (info) =>
        info.table
          .getFilteredRowModel()
          .rows.reduce((sum, row) => sum + row.original.projected_members, 0),
    }),

    // columnHelper.accessor("", {
    //   cell: (info) => (
    //     <>
    //       <span>{info.row.original.organized_tower}</span>
    //       <span className="text-base pl-3">
    //         {`   (${info.row.original.organized_tower_percent.toFixed(2)}%)`}
    //       </span>
    //     </>
    //   ),
    //   header: "ORGANIZED SL",
    //   footer: (info) =>
    //     info.table
    //       .getFilteredRowModel()
    //       .rows.reduce((sum, row) => sum + row.original.organized_tower, 0),
    // }),

    columnHelper.accessor("", {
      cell: (info) => (
        <>
          <span>{info.row.original.organized_tower}</span>
          <span className="text-base pl-3">
            {`   (${info.row.original.organized_tower_percent.toFixed(2)}%)`}
          </span>
        </>
      ),
      header: "ORGANIZED SL",
      footer: (info) => {
        const totalOrganized = info.table
          .getFilteredRowModel()
          .rows.reduce((sum, row) => sum + row.original.organized_tower, 0);

        const totalProjected = info.table
          .getFilteredRowModel()
          .rows.reduce((sum, row) => sum + row.original.projected_tower, 0);

        const percentage =
          totalProjected > 0
            ? ((totalOrganized / totalProjected) * 100).toFixed(2)
            : "0.00";

        return `${totalOrganized} (${percentage}%)`;
      },
    }),

    // columnHelper.accessor("", {
    //   cell: (info) => (
    //     <>
    //       <span>{info.row.original.organized_member}</span>
    //       <span className="text-base pl-3">
    //         {`(${info.row.original.member_percent.toFixed(2)}%)`}
    //       </span>
    //     </>
    //   ),
    //   header: "ORGANIZED MEMBER",
    //   footer: (info) =>
    //     info.table
    //       .getFilteredRowModel()
    //       .rows.reduce((sum, row) => sum + row.original.organized_member, 0),
    // }),

    columnHelper.accessor("", {
      cell: (info) => (
        <>
          <span>{info.row.original.organized_member}</span>
          <span className="text-base pl-3">
            {`   (${info.row.original.member_percent.toFixed(2)}%)`}
          </span>
        </>
      ),
      header: "ORGANIZED MEMBER",
      footer: (info) => {
        const totalOrganized_mem = info.table
          .getFilteredRowModel()
          .rows.reduce((sum, row) => sum + row.original.organized_member, 0);

        const totalProjected_mem = info.table
          .getFilteredRowModel()
          .rows.reduce((sum, row) => sum + row.original.projected_members, 0);

        const percentage =
          totalProjected_mem > 0
            ? ((totalOrganized_mem / totalProjected_mem) * 100).toFixed(2)
            : "0.00";

        return `${totalOrganized_mem} (${percentage}%)`;
      },
    }),

    columnHelper.accessor("", {
      cell: (info) => {
        const {
          projected_winning_votes,
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
            <span>{total_organized_voters || 0}</span>
            <span className="text-base pl-3">
              (
              {(
                (total_organized_voters / projected_winning_votes) * 100 || 0
              ).toFixed(2)}
              %)
            </span>
          </>
        );
      },
      header: "TOTAL ORGANIZED VOTERS",
      footer: (info) => {
        const totalOrganized_voters = info.table
          .getFilteredRowModel()
          .rows.reduce(
            (sum, row) => sum + row.original.total_organized_voters,
            0
          );

        const totalProjected_winvoters = info.table
          .getFilteredRowModel()
          .rows.reduce(
            (sum, row) => sum + row.original.projected_winning_votes,
            0
          );

        const percentage =
          totalProjected_winvoters > 0
            ? (
                (totalOrganized_voters / totalProjected_winvoters) *
                100
              ).toFixed(2)
            : "0.00";

        return `${totalOrganized_voters} (${percentage}%)`;
      },
    }),

    columnHelper.accessor("", {
      cell: (info) => {
        const { voters_ato, survey_ato } = info.row.original;
        const voters_ato_total_new = voters_ato;
        // Calculate the width of the bar based on the percentage of voters_ato
        return (
          <>
            <div className="flex items-center">
              <span>
                {validationType === "Survey"
                  ? survey_ato || 0
                  : voters_ato_total_new || 0}
              </span>
            </div>
          </>
        );
      },
      header: " ",
      // header: "ATO",
      footer: (info) => {
        const rows = info.table.getFilteredRowModel().rows;
        // Calculate the sum conditionally based on validationType
        const total = rows.reduce((sum, row) => {
          if (validationType === "Survey") {
            return sum + (row.original.survey_ato || 0);
          } else {
            return sum + (row.original.voters_ato || 0);
          }
        }, 0);
        return total; // Display the calculated total in the footer
      },
    }),
    columnHelper.accessor("", {
      cell: (info) => {
        const { voters_dili, survey_dili, ntresult_dili } = info.row.original;
        const maxWidthBar = 50; // Maximum width of the bar in units
        const maxValue = info.row.original.voters; // Maximum value to represent (adjust as needed)

        // Calculate the width of the bar based on the percentage of voters_ato
        const barWidth = (voters_dili / maxValue) * maxWidthBar;

        return (
          <>
            <div className="flex items-center">
              <span>
                {validationType === "Survey"
                  ? survey_dili || 0
                  : ntresult_dili || 0}
              </span>
            </div>
          </>
        );
      },
      header: " ",
      // header: "DILI",
      footer: (info) => {
        const rows = info.table.getFilteredRowModel().rows;
        // Calculate the sum conditionally based on validationType
        const total = rows.reduce((sum, row) => {
          if (validationType === "Survey") {
            return sum + (row.original.survey_dili || 0);
          } else {
            return sum + (row.original.ntresult_dili || 0);
          }
        }, 0);
        return total; // Display the calculated total in the footer
      },
    }),
    columnHelper.accessor("", {
      cell: (info) => {
        const { voters_ot, survey_ot } = info.row.original;
        const maxWidthBar = 50; // Maximum width of the bar in units
        const maxValue = info.row.original.voters; // Maximum value to represent (adjust as needed)

        // Calculate the width of the bar based on the percentage of voters_ato
        const barWidth = (voters_ot / maxValue) * maxWidthBar;

        return (
          <>
            <div className="flex items-center">
              <span>
                {validationType === "Survey" ? survey_ot || 0 : voters_ot || 0}
              </span>
            </div>
          </>
        );
      },
      // header: "OUT OF TOWNs",
      header: " ",
      footer: (info) => {
        const rows = info.table.getFilteredRowModel().rows;
        // Calculate the sum conditionally based on validationType
        const total = rows.reduce((sum, row) => {
          if (validationType === "Survey") {
            return sum + (row.original.survey_ot || 0);
          } else {
            return sum + (row.original.voters_ot || 0);
          }
        }, 0);
        return total; // Display the calculated total in the footer
      },
    }),
    columnHelper.accessor("", {
      cell: (info) => {
        const { voters_inc, survey_inc, ntresult_inc } = info.row.original;
        const maxWidthBar = 50; // Maximum width of the bar in units
        const maxValue = info.row.original.voters; // Maximum value to represent (adjust as needed)

        // Calculate the width of the bar based on the percentage of voters_ato
        const barWidth = (voters_inc / maxValue) * maxWidthBar;

        return (
          <>
            <div className="flex items-center">
              <span>
                {validationType === "Survey"
                  ? survey_inc || 0
                  : ntresult_inc || 0}
              </span>
            </div>
          </>
        );
      },
      // header: "INC",
      header: " ",
      footer: (info) => {
        const rows = info.table.getFilteredRowModel().rows;
        // Calculate the sum conditionally based on validationType
        const total = rows.reduce((sum, row) => {
          if (validationType === "Survey") {
            return sum + (row.original.survey_inc || 0);
          } else {
            return sum + (row.original.ntresult_inc || 0);
          }
        }, 0);
        return total; // Display the calculated total in the footer
      },
    }),
    columnHelper.accessor("", {
      cell: (info) => {
        const { voters_jehovah, survey_jv, ntresult_jv } = info.row.original;
        const maxWidthBar = 50; // Maximum width of the bar in units
        const maxValue = info.row.original.voters; // Maximum value to represent (adjust as needed)

        // Calculate the width of the bar based on the percentage of voters_ato
        const barWidth = (voters_jehovah / maxValue) * maxWidthBar;

        return (
          <>
            <div className="flex items-center">
              <span>
                {validationType === "Survey"
                  ? survey_jv || 0
                  : ntresult_jv || 0}
              </span>
            </div>
          </>
        );
      },
      // header: "JEHOVAH",
      header: " ",
      footer: (info) => {
        const rows = info.table.getFilteredRowModel().rows;
        // Calculate the sum conditionally based on validationType
        const total = rows.reduce((sum, row) => {
          if (validationType === "Survey") {
            return sum + (row.original.survey_jv || 0);
          } else {
            return sum + (row.original.ntresult_jv || 0);
          }
        }, 0);
        return total; // Display the calculated total in the footer
      },
    }),

    columnHelper.accessor("", {
      cell: (info) => {
        const { voters_deceased, survey_deceased, ntresult_deceased } =
          info.row.original;
        const maxWidthBar = 50; // Maximum width of the bar in units
        const maxValue = info.row.original.voters; // Maximum value to represent (adjust as needed)

        // Calculate the width of the bar based on the percentage of voters_ato
        const barWidth = (voters_deceased / maxValue) * maxWidthBar;

        return (
          <>
            <div className="flex items-center">
              <span>
                {validationType === "Survey"
                  ? survey_deceased || 0
                  : ntresult_deceased || 0}
              </span>
            </div>
          </>
        );
      },
      // header: "DECEASED",
      header: " ",
      footer: (info) => {
        const rows = info.table.getFilteredRowModel().rows;
        // Calculate the sum conditionally based on validationType
        const total = rows.reduce((sum, row) => {
          if (validationType === "Survey") {
            return sum + (row.original.survey_deceased || 0);
          } else {
            return sum + (row.original.ntresult_deceased || 0);
          }
        }, 0);
        return total; // Display the calculated total in the footer
      },
    }),
    columnHelper.accessor("", {
      cell: (info) => {
        const { voters_undecided, survey_undecided, ntresult_undecided } =
          info.row.original;
        const maxWidthBar = 50; // Maximum width of the bar in units
        const maxValue = info.row.original.voters; // Maximum value to represent (adjust as needed)

        // Calculate the width of the bar based on the percentage of voters_ato
        const barWidth = (voters_undecided / maxValue) * maxWidthBar;

        return (
          <>
            <div className="flex items-center">
              <span>
                {validationType === "Survey"
                  ? survey_undecided || 0
                  : ntresult_undecided || 0}
              </span>
            </div>
          </>
        );
      },
      // header: "UNDECIDED",
      header: " ",
      footer: (info) => {
        const rows = info.table.getFilteredRowModel().rows;
        // Calculate the sum conditionally based on validationType
        const total = rows.reduce((sum, row) => {
          if (validationType === "Survey") {
            return sum + (row.original.survey_undecided || 0);
          } else {
            return sum + (row.original.ntresult_undecided || 0);
          }
        }, 0);
        return total; // Display the calculated total in the footer
      },
    }),
    columnHelper.accessor("", {
      cell: (info) => {
        const { voters_nvs, survey_nvs, ntresult_nvs } = info.row.original;
        const maxWidthBar = 50; // Maximum width of the bar in units
        const maxValue = info.row.original.voters; // Maximum value to represent (adjust as needed)

        // Calculate the width of the bar based on the percentage of voters_ato
        const barWidth = (voters_nvs / maxValue) * maxWidthBar;

        return (
          <>
            <div className="flex items-center">
              <span>
                {validationType === "Survey"
                  ? survey_nvs || 0
                  : ntresult_nvs || 0}
              </span>
            </div>
          </>
        );
      },
      // header: "NVS",
      header: " ",
      footer: (info) => {
        const rows = info.table.getFilteredRowModel().rows;
        // Calculate the sum conditionally based on validationType
        const total = rows.reduce((sum, row) => {
          if (validationType === "Survey") {
            return sum + (row.original.survey_nvs || 0);
          } else {
            return sum + (row.original.ntresult_nvs || 0);
          }
        }, 0);
        return total; // Display the calculated total in the footer
      },
    }),
    columnHelper.accessor("", {
      cell: (info) => {
        const { count_affiliates } = info.row.original;

        return (
          <>
            <div className="flex items-center">
              <span>{count_affiliates || 0}</span>
            </div>
          </>
        );
      },
      // header: "AFFILIATES",
      header: " ",
      footer: (info) => {
        const rows = info.table.getFilteredRowModel().rows;
        // Calculate the sum conditionally based on validationType
        const total = rows.reduce((sum, row) => {
          return sum + (row.original.count_affiliates || 0);
        }, 0);
        return total; // Display the calculated total in the footer
      },
    }),
  ];

  // const data = useMemo(
  //   () => mergeDataforSurvey_and_WithTeam(survey_result, kamada_result) ?? [],
  //   [kamada_result, survey_result]
  // );

  const data = useMemo(() => {
    if (validationType === "Survey") {
      return (
        mergeDataforSurvey_and_WithTeam(
          survey_result,
          count_LP_LM_LDC_W,
          kamada_result
        ) ?? []
      );
    } else {
      return (
        mergeDataforNotTeam_and_WithTeam(
          not_team_result,
          count_LP_LM_LDC_W,
          kamada_result
        ) ?? []
      );
    }
  }, [
    validationType,
    kamada_result,
    count_LP_LM_LDC_W,
    survey_result,
    not_team_result,
  ]);

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
    action: "Exported the Kamada Data to CSV File",
    parameters: "downloading CSV",
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
    rowData?.forEach((item) => {
      for (let key in item) {
        if (item[key] === null) {
          item[key] = 0;
        }
      }
    });

    let transformedData;

    if (validationType === "Survey") {
      transformedData = rowData.map((entry, index) => {
        return {
          brangay: entry.barangay,
          total_voters: entry.voters,
          projected_winning_votes: entry.projected_winning_votes,
          projected_tower: entry.projected_tower,
          projected_members: entry.projected_members,
          organized_tower: entry.organized_tower,
          organized_warriors: entry.organized_member,
          total_organized_voters: entry.total_organized_voters,
          survey_ato: entry.survey_ato,
          survey_dili: entry.survey_dili,
          survey_undecided: entry.survey_undecided,
          survey_deceased: entry.survey_deceased,
          survey_ot: entry.survey_ot,
          survey_inc: entry.survey_inc,
          survey_jv: entry.survey_jv,
          survey_nvs: entry.survey_nvs,
          affiliates: entry.count_affiliates,
        };
      });
      const csv = generateCsv(csvConfig)(transformedData);
      download(csvConfig)(csv);
      insertLogs(params);
    } else {
      transformedData = rowData.map((entry, index) => {
        return {
          brangay: entry.barangay,
          total_voters: entry.voters,
          projected_winning_votes: entry.projected_winning_votes,
          projected_tower: entry.projected_tower,
          projected_members: entry.projected_members,
          organized_tower: entry.organized_tower,
          organized_warriors: entry.organized_member,
          total_organized_voters: entry.total_organized_voters,
          voters_ato: entry.voters_ato,
          voters_ot: entry.voters_ot,
          voters_dili: entry.ntresult_dili,
          voters_undecided: entry.ntresult_undecided,
          voters_deceased: entry.ntresult_deceased,
          voters_inc: entry.ntresult_inc,
          voters_jv: entry.ntresult_jv,
          voters_nvs: entry.ntresult_nvs,
          affiliates: entry.count_affiliates,
        };
      });
      const csv = generateCsv(csvConfig)(transformedData);
      download(csvConfig)(csv);
      insertLogs(params);
    }
  };

  if (isPending || isPending1 || isPending2 || isPending3) return <Spinner />;

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
              <div>
                <Heading as="h2">Kamada Table - {validationType}</Heading>
                <p>
                  List as of{" "}
                  {format(new Date(new Date()), "MMM dd, yyyy  hh:mm a")}
                </p>

                {/* <p>Validation: {new Date().toLocaleDateString()}</p> */}
              </div>
              {/* <Heading as="h2">Kamada Table</Heading>
              <span className="ml-7">{validationType}</span> */}
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
                  <KamadaTable
                    isZoom={true}
                    isHide_search_export={true}
                    validationType={validationType}
                  />
                </Modal.Window>
              </Modal>
            )}
          </div>
          <div
            className="border duration-300 border-gray-500 border-opacity-10  rounded-lg"
            // ref={tableRef}
          >
            {/* <table
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
              <tfoot>
                {table.getFooterGroups().map((footerGroup) => (
                  <tr key={footerGroup.id}>
                    {footerGroup.headers.map((footer) => (
                      <td
                        key={footer.id}
                        className="capitalize text-xl font-extrabold pl-2 pt-2 border-t border-gray-500 border-solid border-opacity-10"
                      >
                        {flexRender(
                          footer.column.columnDef.footer,
                          footer.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tfoot>
            </table> */}

            <table
              className="w-full text-left table-container"
              style={{
                borderCollapse: "collapse",
                margin: 0,
                padding: 0,
                width: "100%",
                tableLayout: "fixed",
              }}
            >
              <thead>
                {table.getHeaderGroups().map((headerGroup, groupIndex) => (
                  <tr key={`header-group-${groupIndex}`}>
                    {/* Unique key using index */}
                    {headerGroup.headers.map((header, headerIndex) => (
                      <th
                        key={`header-${header.id}-${headerIndex}`}
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
                  table.getRowModel().rows.map((row, rowIndex) => (
                    <tr key={`row-${row.id}-${rowIndex}`}>
                      {/* Unique key combining row id and index */}
                      {row.getVisibleCells().map((cell, cellIndex) => (
                        <td
                          key={`cell-${row.id}-${cell.column.id}-${cellIndex}`}
                          className="p-6 py-4 border-b border-gray-500 border-solid border-opacity-10 text-xl"
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
              <tfoot>
                {table.getFooterGroups().map((footerGroup, groupIndex) => (
                  <tr key={`footer-group-${groupIndex}`}>
                    {/* Unique key using footer group index */}
                    {footerGroup.headers.map((footer, footerIndex) => (
                      <td
                        key={`footer-${footer.id}-${footerIndex}`}
                        className="capitalize text-xl font-extrabold pl-2 pt-2 border-t border-gray-500 border-solid border-opacity-10"
                      >
                        {flexRender(
                          footer.column.columnDef.footer,
                          footer.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tfoot>
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
