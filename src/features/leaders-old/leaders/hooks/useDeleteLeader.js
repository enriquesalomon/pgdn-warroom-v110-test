import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteLeader as deleteLeaderApi } from "../../../services/apiLeader";

export function useDeleteLeader() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteLeader } = useMutation({
    // mutationFn: deleteLeaderApi,
    mutationFn: ({ id, electorate_id }) =>
      deleteLeaderApi({ id, electorate_id }),
    onSuccess: () => {
      toast.success("Leader has been successfully deleted");

      queryClient.invalidateQueries({
        queryKey: ["leaders"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteLeader };
}
