import { useQuery } from "@tanstack/react-query";
import { getVoterAto_Unscanned } from "../../../services/apiElectorates";
import { useSearchParams } from "react-router-dom";

export function useOrganizedVoters() {
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy");

  // QUERY
  const {
    isPending,
    data: electorate_validated = [],
    error,
  } = useQuery({
    queryKey: ["voters_unscanned", "3v"],
    queryFn: ({ queryKey }) => getVoterAto_Unscanned("3v"),
  });

  return { isPending, error, electorate_validated };
}
