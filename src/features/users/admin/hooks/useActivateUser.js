import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { activateUser as activateUserApi } from "../../../../services/apiUsers";

export function useActivateUser() {
  const queryClient = useQueryClient();

  const { isPending: isActivating, mutate: activateUser } = useMutation({
    mutationFn: activateUserApi,
    onSuccess: () => {
      toast.success("User successfully activated");

      queryClient.invalidateQueries({
        queryKey: ["users_admin"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isActivating, activateUser };
}
