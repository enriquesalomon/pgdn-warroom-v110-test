import Filter from "../../../ui/Filter";

function ListFilter() {
  return (
    <Filter
      filterField="printed_status"
      options={[
        { value: "all", label: "All" },
        { value: "printed", label: "Printed" },
        { value: "unprinted", label: "Unprinted" },
      ]}
    />
  );
}

export default ListFilter;
