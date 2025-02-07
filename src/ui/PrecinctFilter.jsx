import TableOperations from "./TableOperations";
import { barangayOptions } from "../utils/constants";

import SortBy3 from "./SortBy3";

function PrecinctFilter() {
  return (
    <TableOperations>
      PRECINCT:
      <SortBy3 />
    </TableOperations>
  );
}

export default PrecinctFilter;
