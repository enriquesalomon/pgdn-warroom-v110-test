import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  createEditTeam,
  createTeamValidation,
} from "../../../services/apiTeams";

export function useCreateValidation() {
  const queryClient = useQueryClient();

  const { mutate: createValidation, isPending: isCreating } = useMutation({
    mutationFn: createTeamValidation,
    onSuccess: () => {
      toast.success("New Team Validation successfully created");
      queryClient.invalidateQueries({ queryKey: ["team_list_validation"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createValidation };
}
