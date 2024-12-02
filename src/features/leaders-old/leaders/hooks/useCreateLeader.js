import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createEditLeader } from "../../../services/apiLeader";
import { useSearchParams } from "react-router-dom";
import { barangayOptions } from "../../../utils/constants";

export function useCreateLeader() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const searchTerm = searchParams.get("searchTerm") || "";

  const { mutate: createLeader, isPending: isCreating } = useMutation({
    mutationFn: createEditLeader,
    onSuccess: () => {
      toast.success("New Leader successfully created");
      // queryClient.invalidateQueries({ queryKey: ["electorates"] });
      queryClient.invalidateQueries({
        queryKey: ["leaders", brgy, page, searchTerm],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createLeader };
}
