import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createEditUser } from "../../../../services/apiUsers";

export function useCreateUser() {
  const queryClient = useQueryClient();

  const { mutate: createUser, isPending: isCreating } = useMutation({
    mutationFn: createEditUser,
    onSuccess: () => {
      toast.success("New User successfully created");
      queryClient.invalidateQueries({ queryKey: ["users_PL"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createUser };
}
