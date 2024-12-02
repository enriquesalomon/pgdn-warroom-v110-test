import Spinner from "../../../../ui/Spinner";
import Table from "../../../../ui/Table";
import Menus from "../../../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import UserRowBaco from "./UserRowBaco";
import Search from "../../../../ui/Search";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import Pagination from "../../../../ui/Pagination";
import { useEffect } from "react";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { SiMicrosoftexcel } from "react-icons/si";
import Button from "../../../../ui/Button";
import { barangayOptions } from "../../../../utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../../utils/recordUserActivity";

function UserTableBaco() {
  const [exceldata, setExceldata] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, users, count } = useUser(debouncedSearchTerm);
  const [searchParams] = useSearchParams();

  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const allow_export = userData.user_metadata.account_role === "Super Admin";

  // 1) FILTER
  const filterValue = searchParams.get("is_active_baco") || "all";

  let filteredUsers;
  if (filterValue === "all") filteredUsers = users;
  if (filterValue === "active")
    filteredUsers = users?.filter((user) => user.is_active === "active");
  if (filterValue === "inactive")
    filteredUsers = users?.filter((user) => user.is_active === "inactive");

  // 2) SORT
  const sortBy = searchParams.get("sortBy") || "fullname-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;
  let sortedUsers = filteredUsers?.sort(
    (a, b) => (a[field] - b[field]) * modifier
  );

  useEffect(() => {
    setExceldata(sortedUsers);
  }, [sortedUsers]);

  const csvConfig = mkConfig({
    showTitle: true,
    title: `BACO USER ACCOUNT `,
    fieldSeparator: ",",
    filename: `Baco User Account`, // export file name (without .csv)
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const params = {
    page: "Users (Baco)",
    action: "Exported the Baco User Account Data to Excel File",
    parameters: "downloading excel",
    user_id: userData.id,
  };

  const exportExcel = (rows) => {
    const transformedData = rows.map((entry, index) => {
      return {
        "no.": index + 1,
        name: entry.fullname,
        email: entry.email,
        access_type: entry.accesstype,
        account_role: entry.account_role,
        baco: entry.baco.firstname + " " + entry.baco.lastname,
        brgy: entry.baco.brgy,
        createdby: entry.createdby,
        status: entry.is_active,
      };
    });
    const rowData = transformedData;
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
    insertLogs(params);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Menus>
      <div className="flex-row">
        <div className="w-full ">
          <Search
            terms={"Search Name"}
            onChange={handleSearchChange}
            width="105rem"
          />
          {allow_export && (
            <Button
              disabled={exceldata.length === 0}
              onClick={() => exportExcel(exceldata)}
            >
              <div className="flex justify-center items-center">
                <SiMicrosoftexcel className="mr-2" />
                EXPORT
              </div>
            </Button>
          )}
        </div>
      </div>
      {/* <Table columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr"> */}{" "}
      <Table columns="1.5fr 2.5fr 1fr 1fr 1fr 2fr 2.5fr 1fr 0.5fr">
        <Table.Header>
          <div>Name</div>
          <div>Email</div>
          <div>Barangay</div>
          <div>Access Type</div>
          <div>Account Role</div>
          <div>Baco</div>
          <div>Created by</div>
          <div>Status</div>
        </Table.Header>
        {isPending ? (
          <Spinner />
        ) : (
          <>
            <Table.Body
              data={sortedUsers}
              render={(users) => <UserRowBaco users={users} key={users.id} />}
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

export default UserTableBaco;
