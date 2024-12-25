import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deactivateEvent as deactivateEventApi } from "../../../services/apiEvents";

export function useDeactivateEvent() {
  const queryClient = useQueryClient();

  const { isPending: isDeactivating, mutate: deactivateEvent } = useMutation({
    mutationFn: deactivateEventApi,
    onSuccess: () => {
      toast.success("Event successfully deactivated");

      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeactivating, deactivateEvent };
}
