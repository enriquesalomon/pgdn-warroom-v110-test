import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteBaco as deleteBacoApi } from "../../../services/apiBaco";

export function useDeleteBaco() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteBaco } = useMutation({
    // mutationFn: deleteBacoApi,
    mutationFn: ({ id, electorate_id }) =>
      deleteBacoApi({
        id,
        electorate_id,
      }),
    onSuccess: () => {
      toast.success("Baco has been successfully deleted");

      queryClient.invalidateQueries({
        queryKey: ["baco"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteBaco };
}
