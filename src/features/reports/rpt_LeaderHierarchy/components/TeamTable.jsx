import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import DebouncedInput from "../../../../ui/DebouncedInput";

import Spinner from "../../../../ui/Spinner";
import styled from "styled-components";
import { useTeams } from "../hooks/useLeader";
import Members from "./Members";
import ButtonIcon from "../../../../ui/ButtonIcon";
import { LiaClipboardListSolid } from "react-icons/lia";
// Styling for the two-column layout
const Container = styled.div`
  display: flex;
  gap: 2rem;
`;

const Column = styled.div`
  border: 1px solid gray; /* Adds a 1px solid black border */
  flex: 1;
  padding: 16px;
  border-radius: 6px;
`;

const TeamTable = ({ topleader_name, topleader_id, leader_type }) => {
  const {
    isPending,
    teams = [],
    count,
    fetchTeamData,
  } = useTeams({ topleader_id, leader_type });

  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);

  // Fetch data when a row is selected
  useEffect(() => {
    if (selectedRow) {
      const fetchSelectedRowData = async () => {
        try {
          const data = await fetchTeamData(selectedRow.original.id);
          setSelectedRowData(data);
        } catch (error) {
          console.error("Failed to fetch data for selected row:", error);
        }
      };

      fetchSelectedRowData();
    }
  }, [selectedRow]);

  const dataArray = useMemo(() => teams, [teams]);

  const columnHelper = createColumnHelper();
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        cell: (info) => <span>{info.getValue()}</span>,
        header: "TEAM ID",
      }),
      columnHelper.accessor("tower", {
        cell: (info) => (
          <span>
            {info.row.original.firstname} {info.row.original.lastname}
          </span>
        ),
        header: "TOWER",
      }),
      columnHelper.accessor("barangay", {
        cell: (info) => <span>{info.row.original.barangay}</span>,
        header: "BRGY",
      }),
      columnHelper.accessor("members", {
        cell: (info) => (
          <span>{JSON.parse(info.row.original.members).length - 1}</span>
        ),
        header: "MEMBERS",
      }),
      columnHelper.accessor("view", {
        id: "view", // Explicitly add an id for the button column
        cell: (info) => (
          <button className="px-3 py-1 bg-orange-400 text-white rounded hover:bg-orange-600">
            View
          </button>
        ),
        header: "", // Optional: Add a header title or leave empty for the button column
      }),
    ],

    [columnHelper]
  );

  // Custom filter function for searching by firstname or lastname
  const customFilterFunction = useCallback((row, columnId, filterValue) => {
    const { firstname, lastname } = row.original;
    const searchText = filterValue.toLowerCase();
    return (
      firstname.toLowerCase().includes(searchText) ||
      lastname.toLowerCase().includes(searchText)
    );
  }, []);

  const table = useReactTable({
    data: dataArray,
    columns,
    state: {
      globalFilter,
    },
    globalFilterFn: customFilterFunction, // Use the custom filter function
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isPending) return <Spinner />;

  return (
    <Container className="mt-6">
      {/* First Column with Search and Table */}
      <Column>
        <span className="font-semibold">
          {" "}
          {leader_type + ": " + topleader_name}
        </span>
        <div className="flex justify-between mb-2 mt-7">
          <div className="w-full flex items-center gap-1">
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              className="w-full p-2 bg-transparent border duration-30 border-gray-500 border-opacity-10 rounded-md"
              placeholder="Search"
            />
          </div>
        </div>
        <div className="border duration-300 border-gray-500 border-opacity-10 rounded-lg">
          <table className="w-full text-left">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="capitalize p-6">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedRow(row)} // Set selected row on click
                    className={`cursor-pointer ${
                      selectedRow?.id === row.id
                        ? "bg-gray-200 text-orange-500"
                        : ""
                    }`} // Highlight selected row
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
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
          </table>
        </div>
      </Column>

      {/* Second Column with Conditional Table */}
      <Column>
        {selectedRow && selectedRowData && (
          <Members selectedRowData={selectedRowData} />
        )}
      </Column>
    </Container>
  );
};

export default TeamTable;
