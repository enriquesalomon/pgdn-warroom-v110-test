import Filter from "../../../../ui/Filter";

function ListFilter() {
  return (
    <Filter
      filterField="assigned"
      options={[
        { value: "1", label: "Ato" },
        { value: "0", label: "Unvalidated" },
        { value: "4", label: "OT" },
        { value: "5", label: "INC" },
        { value: "6", label: "JEHOVAH" },
      ]}
    />
  );
}

export default ListFilter;
