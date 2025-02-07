import Filter from "../../../ui/Filter";

function ListFilter4() {
  return (
    <Filter
      filterField="inc_requirments"
      options={[
        { value: "all", label: "All" },
        { value: "no_pic", label: "No Picture" },
        { value: "no_sig", label: "No Signature" },
        { value: "no_qr", label: "No QR Code" },
        { value: "no_colorcode", label: "No Color Code" },
      ]}
    />
  );
}

export default ListFilter4;
