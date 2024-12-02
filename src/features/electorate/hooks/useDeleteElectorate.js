import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteElectorate as deleteElectorateApi } from "../../../services/apiElectorates";

export function useDeleteElectorate() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteElectorate } = useMutation({
    mutationFn: deleteElectorateApi,
    onSuccess: () => {
      toast.success("Electorate has been successfully deleted");

      queryClient.invalidateQueries({
        queryKey: ["all_electorates_per_brgy"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteElectorate };
}
