import TableOperations from "./TableOperations";
import { barangayOptions } from "../utils/constants";

import SortBy2 from "./SortBy2";

function AssistanceTypeFilter(option) {
  console.log("---xx", JSON.stringify(option));
  const data = option;
  // const barangays = JSON.parse(option);
  // const barangays = [];
  // const sortedBarangays = barangays.sort();

  const asstype = [
    { value: "", label: "SELECT" },
    ...data.option.map((asstype) => ({
      value: asstype.name,
      label: asstype.name,
    })),
  ];

  return (
    <TableOperations>
      ASSISTANCE TYPE:
      <SortBy2 options={asstype} />
    </TableOperations>
  );
}

export default AssistanceTypeFilter;
