import Filter from "../../../../ui/Filter";

function FilterList() {
  return (
    <Filter
      filterField="filterby"
      options={[
        { value: "ALL", label: "ALL" },
        { value: "SILDA LEADER", label: "SILDA LEADER" },
        { value: "HOUSEHOLD HEAD", label: "HOUSEHOLD HEAD" },
        {
          value: "SILDA LEADER & HOUSEHOLD HEAD",
          label: "SILDA LEADER & HOUSEHOLD HEAD",
        },
      ]}
    />
  );
}

export default FilterList;
