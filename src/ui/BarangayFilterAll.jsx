import TableOperations from "./TableOperations";
import { barangayOptions } from "../utils/constants";
import SortBy from "./SortBy";

function BarangayFilterAll() {
  console.log("all brangays:", JSON.stringify(barangayOptions));
  return (
    <TableOperations>
      BARANGAY:
      <SortBy options={barangayOptions} />
    </TableOperations>
  );
}

export default BarangayFilterAll;
