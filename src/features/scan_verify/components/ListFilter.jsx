import Filter from "../../../ui/Filter";

function ListFilter() {
  return (
    <Filter
      filterField="voters_remarks"
      options={[
        { value: "1", label: "ALLIED VOTERS" },
        { value: "2", label: "SWING VOTERS" },
      ]}
    />
  );
}

export default ListFilter;
