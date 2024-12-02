import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditSector } from "../../../services/apiSector";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

export function useEditSector() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const { mutate: editSector, isPending: isEditing } = useMutation({
    mutationFn: ({ newElectorateData, id }) =>
      createEditSector(newElectorateData, id),
    onSuccess: () => {
      toast.success("Sector successfully edited");
      // queryClient.invalidateQueries({ queryKey: ["electorates"] });
      queryClient.invalidateQueries({
        queryKey: ["sector", page],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editSector };
}
