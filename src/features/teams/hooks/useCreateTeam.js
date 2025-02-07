import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createEditTeam } from "../../../services/apiTeams";

export function useCreateTeam() {
  const queryClient = useQueryClient();

  const { mutate: createTeam, isPending: isCreating } = useMutation({
    mutationFn: createEditTeam,
    onSuccess: () => {
      toast.success("New Team successfully created");
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["team_list_validation"] });
      queryClient.invalidateQueries({ queryKey: ["team_list"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createTeam };
}
