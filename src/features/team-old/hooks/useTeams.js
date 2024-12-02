import { useQuery } from "@tanstack/react-query";
import { getTeams, getTeamsWithMembers } from "../../../services/apiTeams";
import { useSearchParams } from "react-router-dom";
import { barangayOptions } from "../../../utils/constants";

export function useTeams() {
  // QUERY
  const {
    isPending,
    data: { data: teams, count } = {},
    error,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: ({ queryKey }) => getTeams(),
  });

  return { isPending, error, teams, count };
}

export function useTeamsWithMembers() {
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  // FILTER
  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };

  // QUERY
  const {
    isPending,
    data: { data: teams, count } = {},
    error,
  } = useQuery({
    queryKey: ["teams", brgy],
    queryFn: () => getTeamsWithMembers({ filter, brgy }),
  });

  return { isPending, error, teams, count };
}
