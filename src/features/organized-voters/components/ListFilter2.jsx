import Filter from "../../../ui/Filter";

function ListFilter2() {
  return (
    <Filter
      filterField="id_requirments"
      options={[
        { value: "all", label: "All" },
        { value: "incomplete", label: "Incomplete Requirements" },
        { value: "complete", label: "Completed Requirements" },
      ]}
    />
  );
}

export default ListFilter2;
