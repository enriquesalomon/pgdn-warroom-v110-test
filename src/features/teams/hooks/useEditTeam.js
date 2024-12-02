import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditTeam } from "../../../services/apiTeams";
import { toast } from "react-hot-toast";

export function useEditTeam(precinctnoDefault) {
  const queryClient = useQueryClient();

  const { mutate: editTeam, isPending: isEditing } = useMutation({
    mutationFn: ({ newLeaderData, id, deleteMembersid, new_membersId }) =>
      createEditTeam(newLeaderData, id, deleteMembersid, new_membersId),
    onSuccess: () => {
      toast.success("Team successfully edited");
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["team_members"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editTeam };
}
