import Filter from "../../../ui/Filter";

function ListFilter() {
  return (
    <Filter
      filterField="assigned"
      options={[
        { value: "0", label: "ALL" },
        { value: "4", label: "OT" },
        { value: "5", label: "INC" },
        { value: "6", label: "JEHOVAH" },
      ]}
    />
  );
}

export default ListFilter;
