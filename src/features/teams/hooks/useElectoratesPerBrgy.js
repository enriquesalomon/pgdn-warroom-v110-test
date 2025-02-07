import { useQuery } from "@tanstack/react-query";
import { getElectoratesPerBrgy } from "../../../services/apiElectorates";
import { useSearchParams } from "react-router-dom";

export function useElectoratesPerBrgy() {
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || "ALEGRIA";
  // FILTER
  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };

  // QUERY
  const {
    isPending,
    data: { data: electorates_brgy } = {},
    error,
  } = useQuery({
    queryKey: ["electorates_per_brgy", brgy],
    queryFn: () => getElectoratesPerBrgy({ filter, brgy }),
  });

  return { isPending, error, electorates_brgy };
}
