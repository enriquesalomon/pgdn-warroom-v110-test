import Filter from "../../../ui/Filter";

function ListFilter3() {
  return (
    <Filter
      filterField="voter_type"
      options={[
        { value: "all", label: "All" },
        { value: "gm", label: "GM" },
        { value: "agm", label: "AGM" },
        { value: "legend", label: "LEGEND" },
        { value: "elite", label: "ELITE" },
        { value: "tower", label: "TOWER" },
        { value: "warrior", label: "WARRIOR" },
      ]}
    />
  );
}

export default ListFilter3;
