import { useQuery } from "@tanstack/react-query";
import { getServices } from "../../../services/apiServices";

export function useTeams() {
  const {
    isPending,
    data: services,
    error,
  } = useQuery({
    queryKey: ["service_avail_all"],
    queryFn: getServices,
  });

  return { isPending, error, services };
}
