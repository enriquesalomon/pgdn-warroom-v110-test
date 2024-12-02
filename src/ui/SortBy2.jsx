import { useSearchParams } from "react-router-dom";
import Select from "./Select";

function SortBy2({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const assType = searchParams.get("assType") || "";

  function handleChange(e) {
    searchParams.set("assType", e.target.value);
    setSearchParams(searchParams);
  }

  return (
    <Select
      options={options}
      type="white"
      value={assType}
      onChange={handleChange}
    />
  );
}

export default SortBy2;
