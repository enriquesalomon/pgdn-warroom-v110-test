import Filter from "../../../../ui/Filter";

function FilterList() {
  return (
    <Filter
      filterField="filterby"
      options={[
        { value: "ALL", label: "All" },
        { value: "LUBAS CHAIRPERSON", label: "Lubas Chairperson" },
        { value: "LUBAS MEMBER", label: "Lubas Member" },
        { value: "LDC", label: "LDC" },
        { value: "WATCHER", label: "Watcher" },
      ]}
    />
  );
}

export default FilterList;
