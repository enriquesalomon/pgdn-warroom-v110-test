import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup as signupApi } from "../../../../services/apiAuth";
import { toast } from "react-hot-toast";

export function useSignup() {
  const queryClient = useQueryClient();
  const { mutate: signup, isPending } = useMutation({
    mutationFn: signupApi,
    onSuccess: (user) => {
      toast.success(
        "Account successfully created! Please verify the new account for Activation"
      );
      queryClient.invalidateQueries({
        queryKey: ["users_baco"],
      });
    },
    onError: (err) => {
      console.log("ERROR", err.message);
      toast.error(err.message);
    },
  });

  return { signup, isPending };
}
