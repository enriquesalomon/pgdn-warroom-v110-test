import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteAssType as deleteAssTypeApi } from "../../../services/apiAssistanceType";

export function useDeleteAssType() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteAssType } = useMutation({
    mutationFn: deleteAssTypeApi,
    onSuccess: () => {
      toast.success("Assistance Type has been successfully deleted");

      queryClient.invalidateQueries({
        queryKey: ["asstype"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteAssType };
}
