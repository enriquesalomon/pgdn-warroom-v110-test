import Filter from "../../../ui/Filter";

function ListFilter() {
  return (
    <Filter
      filterField="assigned"
      options={[
        { value: "ALL", label: "ALL" },
        { value: "ATO", label: "ATO" },
        { value: "DILI", label: "DILI" },
        { value: "UNDECIDED", label: "UNDECIDED" },
        { value: "DECEASED", label: "DECEASED" },
        { value: "OUT OF TOWN", label: "OUT OF TOWN" },
        { value: "INC", label: "INC" },
        { value: "JEHOVAH", label: "JEHOVAH" },
        { value: "LUBAS CHAIRPERSON", label: "LUBAS CHAIRPERSON" },
        { value: "LUBAS MEMBER", label: "LUBAS MEMBER" },
      ]}
    />
  );
}

export default ListFilter;
