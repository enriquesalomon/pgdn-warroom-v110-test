import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteTeam as deleteTeamApi } from "../../../services/apiTeams";

export function useDeleteTeam() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteTeam } = useMutation({
    // mutationFn: deleteTeamApi,
    mutationFn: ({ id, electorate_id, gm_id, agm_id, legend_id, elite_id }) =>
      deleteTeamApi({
        id,
        electorate_id,
        gm_id,
        agm_id,
        legend_id,
        elite_id,
      }),
    onSuccess: () => {
      toast.success("Team successfully deleted");

      queryClient.invalidateQueries({
        queryKey: ["teams"],
      });
      queryClient.invalidateQueries({ queryKey: ["team_list_validation"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteTeam };
}
