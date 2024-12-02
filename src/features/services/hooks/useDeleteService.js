import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteService as deleteServiceApi } from "../../../services/apiServices";

export function useDeleteService() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteService } = useMutation({
    mutationFn: deleteServiceApi,
    onSuccess: () => {
      toast.success("Service Availed successfully deleted");

      queryClient.invalidateQueries({
        queryKey: ["service_avail"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteService };
}
