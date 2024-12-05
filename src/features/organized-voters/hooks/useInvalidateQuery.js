import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { barangayOptions } from "../../../utils/constants";
import Empty from "./../../../ui/Empty";

export function useInvalidateQuery(debouncedSearchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const printed_status = searchParams.get("printed_status") || "all";
  //   const searchText = searchParams.get("searchText") || "";
  console.log("searched brgy:", brgy);
  console.log("searched printed_status:", printed_status);
  console.log("searched page:", page);
  console.log("searched searchText:", debouncedSearchTerm);

  // if (debouncedSearchTerm) {
  //   alert("debouncedSearchTerm not empty");
  // } else {
  //   debouncedSearchTerm = "";
  // }
  return () => {
    // queryClient.invalidateQueries({
    //   queryKey: ["all_electorates_per_brgy", brgy, page, "filven"],

    // });
    queryClient.invalidateQueries({
      queryKey: [
        "electorates_ato",
        brgy,
        printed_status,
        page,
        debouncedSearchTerm,
      ],
    });
  };
}
