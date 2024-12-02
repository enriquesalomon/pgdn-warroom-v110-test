import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createEditAssType } from "../../../services/apiAssistanceType";
import { useSearchParams } from "react-router-dom";

export function useCreateAssType() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const { mutate: createAssType, isPending: isCreating } = useMutation({
    mutationFn: createEditAssType,
    onSuccess: () => {
      toast.success("New Assisntace Type successfully created");
      queryClient.invalidateQueries({
        queryKey: ["asstype", page],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createAssType };
}
