import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deactivateUser as deactivateUserApi } from "../../../../services/apiUsers";

export function useDeactivateUser() {
  const queryClient = useQueryClient();

  const { isPending: isDeactivating, mutate: deactivateUser } = useMutation({
    mutationFn: deactivateUserApi,
    onSuccess: () => {
      toast.success("User successfully deactivated");

      queryClient.invalidateQueries({
        queryKey: ["users_admin"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeactivating, deactivateUser };
}
