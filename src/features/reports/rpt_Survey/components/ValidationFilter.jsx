import Filter from "../../../../ui/Filter";

function ValidationFilter() {
  return (
    <Filter
      filterField="validation"
      options={[
        { value: "1v", label: "1st Validation" },
        { value: "2v", label: "2nd Validation" },
        { value: "3v", label: "3rd Validation" },
      ]}
    />
  );
}

export default ValidationFilter;
