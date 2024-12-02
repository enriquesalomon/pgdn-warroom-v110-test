import "./SearchResult.css";

export const SearchResult = ({ result, onClick }) => {
  return (
    <div className="result-item border-b border-gray-200 flex flex-col">
      <span className="search-result" onClick={() => onClick(result)}>
        {result.precinctno} {result.firstname} {result.middlename}
        {result.lastname}
      </span>
    </div>
  );
  // return (
  //   <div
  //     className="search-result"
  //     onClick={(e) => alert(`You selected ${result}!`)}
  //   >
  //     {result}
  //   </div>
  // );
};
