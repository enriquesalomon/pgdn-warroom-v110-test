import TableOperations from "../../../../ui/TableOperations";
import Filter from "../../../../ui/Filter";

function UserTableOperationsPL() {
  return (
    <TableOperations>
      <Filter
        filterField="is_active_PL"
        options={[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
      />
    </TableOperations>
  );
}

export default UserTableOperationsPL;
