import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditBaco } from "../../../services/apiBaco";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { barangayOptions } from "../../../utils/constants";

export function useEditBaco(searchText) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const searchTerm = searchParams.get("searchTerm") || searchText;
  console.log("......--", searchTerm);
  const { mutate: editBaco, isPending: isEditing } = useMutation({
    mutationFn: ({ newElectorateData, id }) =>
      createEditBaco(newElectorateData, id),
    onSuccess: () => {
      toast.success("Baco successfully edited");
      // queryClient.invalidateQueries({ queryKey: ["electorates"] });
      queryClient.invalidateQueries({
        queryKey: ["baco", page, searchTerm],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editBaco };
}
