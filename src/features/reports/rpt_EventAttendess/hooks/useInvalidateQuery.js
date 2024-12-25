import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export function useInvalidateQuery(debouncedSearchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const event = searchParams.get("event");
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  return () => {
    // queryClient.invalidateQueries({
    //   queryKey: ["all_electorates_per_brgy", brgy, page, "filven"],

    // });
    // queryFn: () => getEventAttendees({ brgy, page: page - 1, searchTerm }),
    queryClient.invalidateQueries({
      queryKey: ["attendees", event, page, debouncedSearchTerm],
    });
  };
}
