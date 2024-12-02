import Filter from "../../../ui/Filter";

function RequestType() {
  return (
    <Filter
      filterField="type"
      options={[
        { value: "all", label: "All" },
        { value: "list", label: "List" },
        { value: "delist", label: "Delist" },
      ]}
    />
  );
}

export default RequestType;
