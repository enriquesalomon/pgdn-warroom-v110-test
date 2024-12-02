import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { createEditBaco } from "../../../../services/apiBaco";

export function useCreateBaco() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const searchTerm = searchParams.get("searchTerm") || "";

  const { mutate: createBaco, isPending: isCreating } = useMutation({
    mutationFn: createEditBaco,
    onSuccess: () => {
      toast.success("New Baco successfully created");
      // queryClient.invalidateQueries({ queryKey: ["electorates"] });
      queryClient.invalidateQueries({
        queryKey: ["baco", page, searchTerm],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createBaco };
}
