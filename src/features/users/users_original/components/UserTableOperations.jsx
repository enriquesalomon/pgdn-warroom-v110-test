import TableOperations from "../../../../ui/TableOperations";
import Filter from "../../../../ui/Filter";
// import SortBy from "../../../ui/SortBy";

function UserTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="is_active"
        options={[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
      />

      {/* <SortBy
        options={[
          { value: "fullname-asc", label: "Sort by fullname (A-Z)" },
          { value: "fullname-desc", label: "Sort by fullname (Z-A)" },
        ]}
      /> */}
    </TableOperations>
  );
}

export default UserTableOperations;
