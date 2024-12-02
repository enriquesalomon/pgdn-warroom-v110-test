import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deactivateLeader as deactivateLeaderApi } from "../../../services/apiLeader";

export function useDeactivateLeader() {
  const queryClient = useQueryClient();

  const { isPending: isDeactivating, mutate: deactivateLeader } = useMutation({
    mutationFn: deactivateLeaderApi,
    onSuccess: () => {
      toast.success("Leader successfully deactivated");

      queryClient.invalidateQueries({
        queryKey: ["leaders"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeactivating, deactivateLeader };
}
