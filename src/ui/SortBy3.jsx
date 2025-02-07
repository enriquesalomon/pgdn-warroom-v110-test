import { useSearchParams } from "react-router-dom";
import Select from "./Select";
import { useFirstSelectData } from "../features/teams/hooks/useData";

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "green" : "white", // Background color of each option
    color: state.isDisabled ? "green" : "black",
    width: "100%", // Width of each option
    "&:hover": {
      backgroundColor: "green", // Background color when hovering
      color: "white", // Text color when hovering
    },
  }),
};
function SortBy3({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const precinctBy = searchParams.get("precinctBy") || "";

  function handleChange(e) {
    searchParams.set("precinctBy", e.target.value);
    setSearchParams(searchParams);
  }

  const { data, isLoading: firstLoading } = useFirstSelectData();
  const firstData = data?.data || [];

  // Add the new entry
  // Check if "ALL PRECINCT" already exists
  if (!firstData.some((item) => item.precinct_no === "ALL PRECINCT")) {
    firstData.push({ precinct_no: "ALL PRECINCT" });
  }
  return (
    <Select
      id="precinct_no"
      type="white"
      isLoading={firstLoading}
      options={firstData?.map((item) => ({
        value: item.precinct_no,
        label: item.precinct_no,
      }))}
      // onChange={handleFirstChange}
      value={precinctBy}
      // isDisabled={isEditSession || isWorking}
      styles={customStyles}
      onChange={handleChange}
    />
  );
}

export default SortBy3;
