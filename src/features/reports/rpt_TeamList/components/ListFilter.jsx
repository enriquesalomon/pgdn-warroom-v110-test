import Filter from "../../../../ui/Filter";

function ListFilter() {
  return (
    <Filter
      filterField="assigned"
      options={[
        { value: "gm", label: "GM" },
        { value: "agm", label: "AGM" },
        { value: "legend", label: "LEGEND" },
        { value: "elite", label: "ELITE" },
      ]}
    />
  );
}

export default ListFilter;
