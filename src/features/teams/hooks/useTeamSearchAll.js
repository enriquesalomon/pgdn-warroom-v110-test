import { useQuery } from "@tanstack/react-query";
import { getTeams } from "../../../services/apiTeams";

export function useTeams() {
  const {
    isPending,
    data: teams,
    error,
  } = useQuery({
    queryKey: ["all_teams"],
    queryFn: getTeams,
  });

  return { isPending, error, teams };
}
