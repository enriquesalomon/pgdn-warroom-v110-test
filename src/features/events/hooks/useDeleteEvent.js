import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteEvent as deleteServiceApi } from "../../../services/apiEvents";

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteEvent } = useMutation({
    mutationFn: deleteServiceApi,
    onSuccess: () => {
      toast.success("Event successfully deleted");

      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteEvent };
}
