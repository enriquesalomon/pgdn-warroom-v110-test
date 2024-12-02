import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deactivateTeam as deactivateTeamApi } from "../../../services/apiTeams";

export function useDeactivateTeam() {
  const queryClient = useQueryClient();

  const { isPending: isDeactivating, mutate: deactivateTeam } = useMutation({
    mutationFn: deactivateTeamApi,
    onSuccess: () => {
      toast.success("Team successfully deactivated");

      queryClient.invalidateQueries({
        queryKey: ["teams"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeactivating, deactivateTeam };
}
