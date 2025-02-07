import TableOperations from "./TableOperations";
import { barangayOptions } from "../utils/constants";
import SortBy from "./SortBy";

function BarangayFilterAll() {
  return (
    <TableOperations>
      BARANGAY:
      <SortBy options={barangayOptions} />
    </TableOperations>
  );
}

export default BarangayFilterAll;
