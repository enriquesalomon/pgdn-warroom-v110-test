import Filter from "../../../../ui/Filter";

function ListFilter() {
  return (
    <Filter
      filterField="result"
      options={[
        { value: "ALL", label: "ALL" },
        { value: "ATO", label: "ATO" },
        { value: "DILI", label: "DILI" },
        { value: "OUT OF TOWN", label: "OOT" },
        { value: "INC", label: "INC" },
        { value: "JEHOVAH", label: "JEHOVAH" },
        { value: "DECEASED", label: "DECEASED" },
        { value: "UNDECIDED", label: "UNDECIDED" },
        { value: "NVS", label: "NVS" },
        // { value: "UNVALIDATED", label: "UNVALIDATED" },
      ]}
    />
  );
}

export default ListFilter;
