import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createEditElectorate } from "../../../services/apiElectorates";
import { useSearchParams } from "react-router-dom";
import { barangayOptions } from "../../../utils/constants";

export function useCreateElectorate() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const searchTerm = searchParams.get("searchTerm") || "";

  const { mutate: createElectorates, isPending: isCreating } = useMutation({
    mutationFn: createEditElectorate,
    onSuccess: () => {
      toast.success("New Electorate successfully created");
      // queryClient.invalidateQueries({ queryKey: ["electorates"] });
      queryClient.invalidateQueries({
        queryKey: ["all_electorates_per_brgy", brgy, page, searchTerm],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createElectorates };
}
