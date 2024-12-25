import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { activateEvent as activateEventApi } from "../../../services/apiEvents";

export function useActivateEvent() {
  const queryClient = useQueryClient();

  const { isPending: isActivating, mutate: activateEvent } = useMutation({
    mutationFn: activateEventApi,
    onSuccess: () => {
      toast.success("Event successfully activated");

      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isActivating, activateEvent };
}
