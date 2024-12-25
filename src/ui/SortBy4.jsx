import { useSearchParams } from "react-router-dom";
import Select from "react-select";

function SortBy4({ options }) {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "500px", // Set your desired width here
    }),
  };

  const [searchParams, setSearchParams] = useSearchParams();

  // Get the current event value from searchParams and find the corresponding option object
  const event = searchParams.get("event") || "";
  const selectedOption =
    options.find((option) => option.value === event) || null;

  // Handle change and update the searchParams
  function handleChange(selectedOption) {
    // Set the 'event' query parameter based on the selected option's value
    searchParams.set("event", selectedOption ? selectedOption.value : "");
    setSearchParams(searchParams);
  }

  return (
    <Select
      options={options}
      value={selectedOption} // Pass the whole option object, not just the value
      onChange={handleChange}
      styles={customStyles}
    />
  );
}

export default SortBy4;
