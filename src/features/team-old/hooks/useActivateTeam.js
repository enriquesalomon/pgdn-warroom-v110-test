import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { activateTeam as activateTeamApi } from "../../../services/apiTeams";

export function useActivateTeam() {
  const queryClient = useQueryClient();

  const { isPending: isActivating, mutate: activateTeam } = useMutation({
    mutationFn: activateTeamApi,
    onSuccess: () => {
      toast.success("Team successfully deactivated");

      queryClient.invalidateQueries({
        queryKey: ["teams"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isActivating, activateTeam };
}
