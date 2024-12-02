import TableOperations from "../../../../ui/TableOperations";
import Filter from "../../../../ui/Filter";

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
    </TableOperations>
  );
}

export default UserTableOperations;
