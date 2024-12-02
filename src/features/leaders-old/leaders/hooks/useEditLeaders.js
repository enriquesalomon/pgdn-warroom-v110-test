import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditLeader } from "../../../services/apiLeader";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { barangayOptions } from "../../../utils/constants";

export function useEditLeaders() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const searchTerm = searchParams.get("searchTerm") || "";

  const { mutate: editLeader, isPending: isEditing } = useMutation({
    mutationFn: ({ newElectorateData, id }) =>
      createEditLeader(newElectorateData, id),
    onSuccess: () => {
      toast.success("Leader successfully edited");
      // queryClient.invalidateQueries({ queryKey: ["electorates"] });
      queryClient.invalidateQueries({
        queryKey: ["leaders", brgy, page, searchTerm],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editLeader };
}
