import Filter from "../../../../ui/Filter";

function ListFilter() {
  return (
    <Filter
      filterField="assigned"
      options={[
        { value: "all", label: "All" },
        { value: "1", label: "ATO" },
        { value: "4", label: "OUT OF TOWN" },
      ]}
    />
  );
}

export default ListFilter;
