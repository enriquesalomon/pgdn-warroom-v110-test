import Spinner from "../../../../ui/Spinner";
import Table from "../../../../ui/Table";
import Menus from "../../../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import UserRow from "./UserRow";
import Search from "../../../../ui/Search";
import { useState } from "react";

function UserTable() {
  const { isPending, users } = useUser();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  // 1) FILTER
  const filterValue = searchParams.get("is_active") || "all";

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

  sortedUsers = sortedUsers?.filter(
    (item) =>
      (item.fullname &&
        item.fullname.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.email &&
        item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.accesstype &&
        item.accesstype.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.account_role &&
        item.account_role.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  return (
    <Menus>
      <Search onChange={handleSearchChange} width="116rem" />
      <Table columns="1.8fr 2fr 1.8fr 1fr 1fr 1.8fr  1fr 1fr">
        <Table.Header>
          <div>fullname</div>
          <div>Email</div>
          <div>Contact No.</div>
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
              render={(users) => <UserRow users={users} key={users.id} />}
            />
          </>
        )}
      </Table>
    </Menus>
  );
}

export default UserTable;
