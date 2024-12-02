import "./SearchResultsList.css";
import { SearchResult } from "./SearchResult";

const SearchResultsList = ({ results, onResultClick }) => {
  return (
    <div className="results-list">
      {results.map((result, id) => {
        return (
          <SearchResult
            result={result}
            key={id}
            onClick={(clickedResult) => onResultClick(clickedResult)}
          />
        );
      })}
    </div>
  );
};
export default SearchResultsList;
