import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import DebouncedInput from "../../../../ui/DebouncedInput";
import { mkConfig, generateCsv, download } from "export-to-csv";
import Button from "../../../../ui/Button";
import { SiMicrosoftexcel } from "react-icons/si";
import Heading from "../../../../ui/Heading";
import Spinner from "../../../../ui/Spinner";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../../utils/recordUserActivity";
import styled from "styled-components";

const StyledBookingDataBox = styled.section`
  /* Box */
  background-color: var(--color-orange-500);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 1rem 2rem;

  overflow: hidden;
`;
const BeneficiaryTable = ({ electorate_id, all_services, fullname }) => {
  const dataArray = all_services.filter(
    (item) => item.electorate_id === electorate_id
  );
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("assistance_type", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "ASSISTANCE TYPE",
    }),
    columnHelper.accessor("date_availed", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "DATE AVAILED",
    }),
    columnHelper.accessor("description", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "DESCRIPTION",
    }),
  ];
  const data = useMemo(() => dataArray ?? [], [dataArray]);

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

  const csvConfig = mkConfig({
    fieldSeparator: ",",
    filename: fullname, // export file name (without .csv)
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);

  const params = {
    page: "Reports Services Beneficiary",
    action: `Exported the Beneficiary: ${fullname} Data to Excel File`,
    parameters: `downloading excel`,
    user_id: userData.id,
  };

  const exportExcel = (rows) => {
    const filteredrow = rows.map((row) => {
      const { id, user_id, electorate_id, created_at, ...originalWithoutIds } =
        row.original;
      return { ...row, original: originalWithoutIds };
    });
    const rowData = filteredrow.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
    insertLogs(params);
  };
  if (!dataArray) return <Spinner />;
  return (
    <div className="mt-6">
      <StyledBookingDataBox>
        <Heading as="h1">
          <span className="text-white">BENEFICIARY: {fullname}</span>
        </Heading>
      </StyledBookingDataBox>

      <div className="flex justify-between mb-2 mt-7">
        <div className="w-full flex items-center gap-1">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="w-full  p-2 bg-transparent border duration-30 border-gray-500 border-opacity-10 rounded-md  "
            placeholder="Search"
          />
        </div>
        <Button onClick={() => exportExcel(table.getFilteredRowModel().rows)}>
          <div className="flex justify-center items-center">
            <SiMicrosoftexcel className="mr-2" />
            EXPORT
          </div>
        </Button>
      </div>
      <div className="border duration-300 border-gray-500 border-opacity-10  rounded-lg">
        <table className=" w-full text-left">
          <thead className="">
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
    </div>
  );
};

export default BeneficiaryTable;
