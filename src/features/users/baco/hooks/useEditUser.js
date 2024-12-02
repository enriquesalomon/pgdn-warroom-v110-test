import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditBacoUser } from "../../../../services/apiBaco";
import { toast } from "react-hot-toast";

export function useEditUser() {
  const queryClient = useQueryClient();

  const { mutate: editUser, isPending: isEditing } = useMutation({
    mutationFn: ({ newUserData, id }) => createEditBacoUser(newUserData, id),
    onSuccess: () => {
      toast.success("User successfully edited");
      queryClient.invalidateQueries({
        queryKey: ["users_baco"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editUser };
}
