// import { useSearchParams } from "react-router-dom";
// import Select from "./Select";

// function SortBy({ options }) {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const sortBy = searchParams.get("sortBy") || "";

//   function handleChange(e) {
//     searchParams.delete("page"); // Remove the page query parameter
//     searchParams.set("sortBy", e.target.value);
//     setSearchParams(searchParams);
//   }

//   return (
//     <Select
//       options={options}
//       type="white"
//       value={sortBy}
//       onChange={handleChange}
//     />
//   );
// }

// export default SortBy;
import { useSearchParams } from "react-router-dom";
import Select from "react-select";

function SortBy({ options }) {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "500px", // Set your desired width here
    }),
  };

  const [searchParams, setSearchParams] = useSearchParams();

  // Get the current sortBy value from searchParams and find the corresponding option object
  const sortBy = searchParams.get("sortBy") || "";
  const selectedOption =
    options.find((option) => option.value === sortBy) || null;

  function handleChange(selectedOption) {
    // If selectedOption is not null, set the sortBy query parameter
    if (selectedOption) {
      searchParams.delete("page"); // Remove the page query parameter
      searchParams.set("sortBy", selectedOption.value); // Use selectedOption.value
      setSearchParams(searchParams);
    }
  }

  return (
    <Select
      options={options}
      value={selectedOption} // Pass the whole option object, not just the value
      onChange={handleChange} // Handle the object passed by react-select
      styles={customStyles}
    />
  );
}

export default SortBy;
