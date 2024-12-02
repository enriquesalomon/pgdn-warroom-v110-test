import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteSector as deleteSectorApi } from "../../../services/apiSector";

export function useDeleteSector() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteSector } = useMutation({
    mutationFn: deleteSectorApi,
    onSuccess: () => {
      toast.success("Sector has been successfully deleted");

      queryClient.invalidateQueries({
        queryKey: ["sector"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteSector };
}
