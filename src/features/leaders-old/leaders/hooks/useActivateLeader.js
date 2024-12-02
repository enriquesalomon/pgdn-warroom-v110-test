import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { activateLeader as activateLeaderApi } from "../../../services/apiLeader";

export function useActivateLeader() {
  const queryClient = useQueryClient();

  const { isPending: isActivating, mutate: activateLeader } = useMutation({
    mutationFn: activateLeaderApi,
    onSuccess: () => {
      toast.success("Leader successfully deactivated");

      queryClient.invalidateQueries({
        queryKey: ["leaders"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isActivating, activateLeader };
}
