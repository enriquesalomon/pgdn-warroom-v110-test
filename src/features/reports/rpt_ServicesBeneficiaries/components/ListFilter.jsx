import Filter from "../../../../ui/Filter";

function ListFilter() {
  return (
    <Filter
      filterField="voters_type"
      options={[
        { value: "ALL", label: "ALL" },
        { value: "BACO", label: "BACO" },
        { value: "GM", label: "GM" },
        { value: "AGM", label: "AGM" },
        { value: "LEGEND", label: "LEGEND" },
        { value: "ELITE", label: "ELITE" },
        { value: "TOWER", label: "TOWER" },
        { value: "WARRIORS", label: "WARRIORS" },
        { value: "NOT_IN_TEAM", label: "NOT IN TEAM " },
      ]}
    />
  );
}

export default ListFilter;
