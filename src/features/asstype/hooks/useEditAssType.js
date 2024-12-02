import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditAssType } from "../../../services/apiAssistanceType";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

export function useEditAssType() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const { mutate: editAssType, isPending: isEditing } = useMutation({
    mutationFn: ({ newElectorateData, id }) =>
      createEditAssType(newElectorateData, id),
    onSuccess: () => {
      toast.success("Assistance Type successfully edited");
      // queryClient.invalidateQueries({ queryKey: ["electorates"] });
      queryClient.invalidateQueries({
        queryKey: ["asstype", page],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editAssType };
}
