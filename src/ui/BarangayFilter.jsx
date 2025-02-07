import TableOperations from "./TableOperations";
import { barangayOptions } from "../utils/constants";
import SortBy from "./SortBy";

function BarangayFilter(viewable_brgy) {
  console.log("brgy", JSON.stringify(viewable_brgy));
  const barangays = JSON.parse(viewable_brgy.viewable_brgy);
  const sortedBarangays = barangays.sort();
  const brgy = [
    { value: "", label: "SELECT BARANGAY" },
    ...sortedBarangays?.map((barangay) => ({
      value: barangay.toUpperCase(),
      label: barangay.toUpperCase(),
    })),
  ];
  return (
    <TableOperations>
      BARANGAY:
      <SortBy options={brgy} />
    </TableOperations>
  );
}

export default BarangayFilter;
