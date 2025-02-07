import Filter from "../../../../ui/Filter";

function ListFilter() {
  return (
    <Filter
      filterField="voters_type"
      options={[
        { value: "ALL", label: "ALL" },    
        { value: "PRECINCT_LEADER", label: "PRECINCT LEADER" },
        { value: "MEMBERS", label: "MEMBERS" },
        { value: "NOT_IN_TEAM", label: "NOT IN TEAM " },
      ]}
    />
  );
}

export default ListFilter;
