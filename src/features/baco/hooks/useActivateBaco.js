import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { activateBaco as activateBacoApi } from "../../../services/apiBaco";

export function useActivateBaco() {
  const queryClient = useQueryClient();

  const { isPending: isActivating, mutate: activateBaco } = useMutation({
    mutationFn: activateBacoApi,
    onSuccess: () => {
      toast.success("Baco successfully deactivated");

      queryClient.invalidateQueries({
        queryKey: ["baco"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isActivating, activateBaco };
}
