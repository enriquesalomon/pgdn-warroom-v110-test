import Spinner from "../../../../ui/Spinner";
import Table from "../../../../ui/Table";
import Menus from "../../../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import Search from "../../../../ui/Search";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import Pagination from "../../../../ui/Pagination";

import UserRowStaff from "./UserRowStaff";

function UserTableStaff() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, users, count } = useUser(debouncedSearchTerm);
  const [searchParams] = useSearchParams();

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
            width="100%"
          />
        </div>
      </div>
      {/* <Table columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr"> */}{" "}
      <Table columns="1.5fr 2.5fr 1fr 1fr 1fr 2fr 1fr 0.5fr">
        <Table.Header>
          <div>Name</div>
          <div>Email</div>
          <div>Barangay</div>
          <div>Access Type</div>
          <div>Account Role</div>
          <div>Created by</div>
          <div>Status</div>
        </Table.Header>
        {isPending ? (
          <Spinner />
        ) : (
          <>
            <Table.Body
              data={sortedUsers}
              render={(users) => <UserRowStaff users={users} key={users.id} />}
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

export default UserTableStaff;
