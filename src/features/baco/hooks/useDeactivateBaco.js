import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deactivateBaco as deactivateBacoApi } from "../../../services/apiBaco";

export function useDeactivateBaco() {
  const queryClient = useQueryClient();

  const { isPending: isDeactivating, mutate: deactivateBaco } = useMutation({
    mutationFn: deactivateBacoApi,
    onSuccess: () => {
      toast.success("Baco successfully deactivated");

      queryClient.invalidateQueries({
        queryKey: ["baco"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeactivating, deactivateBaco };
}
