import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useElectoratesSearch } from "./useElectoratesSearch";

import "./SearchBar.css";

const SearchBar = ({ setResults }) => {
  const [searchname, setInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { data: results, isLoading, error } = useElectoratesSearch(searchname);
  // Debounce function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchname);
    }, 500); // Adjust the delay as needed

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchname]);
  const handleChange = (value) => {
    setInput(value);
  };

  // Update results when data changes
  useEffect(() => {
    if (results) {
      setResults(results);
    }
  }, [results, setResults]);
  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Type to search..."
        value={searchname}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
